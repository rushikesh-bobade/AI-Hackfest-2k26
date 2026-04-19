import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Analysis, AnalysisStatus, Claim, ContradictionEntry, SolanaTransaction } from "~/data/types";
import { ANALYSIS_STEPS } from "~/data/types";
import {
  MOCK_ANALYSES,
  MOCK_TRANSACTIONS,
  generateAnalysisId,
  generateTxSignature,
} from "~/data/mock-data";
import { useAuth } from "./use-auth";

interface AnalysisStoreContextValue {
  analyses: Analysis[];
  claims: Claim[];
  contradictions: ContradictionEntry[];
  rebuttal: string;
  transactions: SolanaTransaction[];
  currentAnalysisId: string | null;
  processingStatus: AnalysisStatus;
  processingProgress: number;
  audioUrl: string;
  startAnalysis: (file: File) => Promise<string | null>;
  getAnalysisById: (id: string) => Analysis | undefined;
  deleteAllHistory: () => void;
  getClaimsForAnalysis: (id: string) => Claim[];
  getContradictionsForAnalysis: (id: string) => ContradictionEntry[];
  getRebuttalForAnalysis: (id: string) => string;
  getAudioUrlForAnalysis: (id: string) => string;
}

const AnalysisStoreContext = createContext<AnalysisStoreContextValue | null>(null);

// Store detailed results per analysis
const analysisDetailsCache = new Map<
  string,
  { claims: Claim[]; contradictions: ContradictionEntry[]; rebuttal: string; audioUrl: string }
>();

export function AnalysisStoreProvider({ children }: { children: ReactNode }) {
  const { user, updateTokens } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [contradictions, setContradictions] = useState<ContradictionEntry[]>([]);
  const [rebuttal, setRebuttal] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [transactions, setTransactions] = useState<SolanaTransaction[]>([]);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<AnalysisStatus>("idle");
  const [processingProgress, setProcessingProgress] = useState(0);

  // Load history on user change
  useEffect(() => {
    if (!user) {
      setAnalyses([]);
      setTransactions([]);
      return;
    }

    // Demo user gets mock data
    const isDemoUser = user.email === "demo@papershredder.ai";
    if (isDemoUser) {
      setAnalyses(MOCK_ANALYSES);
      setTransactions(MOCK_TRANSACTIONS);
    } else {
      setAnalyses([]);
      setTransactions([]);
    }

    // Also load real history from Snowflake
    fetch(`/api/history?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.analyses.length > 0) {
          const sfAnalyses: Analysis[] = data.analyses.map((a: any) => ({
            id: a.id,
            title: a.title,
            authors: a.authors,
            uploadDate: a.uploadDate,
            wordCount: a.wordCount,
            claimCount: a.claimCount,
            rebuttalSnippet: a.rebuttalSnippet,
            status: a.status as AnalysisStatus,
            credibilityScore: a.credibilityScore,
            tokensCost: a.tokensCost,
            fileName: a.fileName,
          }));
          setAnalyses((prev) => {
            const ids = new Set(sfAnalyses.map((a) => a.id));
            const kept = prev.filter((a) => !ids.has(a.id));
            return [...sfAnalyses, ...kept];
          });
          for (const a of data.analyses) {
            analysisDetailsCache.set(a.id, {
              claims: a.claims ?? [],
              contradictions: (a.contradictions ?? []).map((c: any) => ({
                ...c,
                paperId: a.id,
              })),
              rebuttal: a.rebuttal ?? "",
              audioUrl: a.audioUrl ?? "",
            });
          }
        }
      })
      .catch((e) => console.warn("Failed to load history from Snowflake:", e));
  }, [user]);

  const startAnalysis = useCallback(
    async (file: File): Promise<string | null> => {
      if (!user) return null;
      if (user.tokensRemaining < 50) return null;

      const analysisId = generateAnalysisId();
      setCurrentAnalysisId(analysisId);
      setProcessingProgress(0);

      const newAnalysis: Analysis = {
        id: analysisId,
        title: file.name.replace(".pdf", "").replace(/-|_/g, " "),
        authors: [user.name],
        uploadDate: new Date().toISOString(),
        wordCount: 0,
        claimCount: 0,
        rebuttalSnippet: "",
        status: "uploading",
        credibilityScore: 0,
        tokensCost: 50,
        fileName: file.name,
      };

      setAnalyses((prev) => [newAnalysis, ...prev]);

      // Start the real API call with a timeout
      const apiCall = async () => {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("userId", user.id);
        formData.append("analysisId", analysisId);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error ?? "Analysis failed");
          }

          return response.json();
        } finally {
          clearTimeout(timeout);
        }
      };

      // Animate steps sequentially, pausing to wait for API at the right moment
      const showStep = (stepIndex: number) => {
        const step = ANALYSIS_STEPS[stepIndex];
        if (!step) return;
        setProcessingStatus(step.status);
        setProcessingProgress(Math.round(((stepIndex + 1) / ANALYSIS_STEPS.length) * 100));
        setAnalyses((prev) =>
          prev.map((a) => (a.id === analysisId ? { ...a, status: step.status } : a))
        );
      };

      try {
        // Step 0: uploading (1.5s)
        showStep(0);
        await new Promise((r) => setTimeout(r, 1500));

        // Step 1: extracting (start API call here)
        showStep(1);
        const apiPromise = apiCall();
        await new Promise((r) => setTimeout(r, 2000));

        // Step 2: cross-referencing — WAIT for API here
        showStep(2);
        const result = await apiPromise;

        // Step 3: generating (quick, API already done)
        showStep(3);
        await new Promise((r) => setTimeout(r, 800));

        // Step 4: narrating
        showStep(4);
        await new Promise((r) => setTimeout(r, 800));

        // Update with real data from Gemini
        setAnalyses((prev) =>
          prev.map((a) =>
            a.id === analysisId
              ? {
                  ...a,
                  title: result.title ?? a.title,
                  authors: result.authors ?? a.authors,
                  wordCount: result.wordCount ?? 0,
                  status: "complete" as const,
                  credibilityScore: result.credibilityScore ?? 0,
                  claimCount: result.claims?.length ?? 0,
                  rebuttalSnippet: result.rebuttalSnippet ?? "",
                }
              : a
          )
        );

        // Store the detailed results
        const newClaims: Claim[] = (result.claims ?? []).map((c: any) => ({
          id: c.id,
          text: c.text,
          section: c.section,
          fallacy: c.fallacy,
          severity: c.severity,
          confidence: c.confidence,
        }));

        const newContradictions: ContradictionEntry[] = (result.contradictions ?? []).map((c: any) => ({
          paperId: analysisId,
          claimId: c.claimId,
          paperSays: c.paperSays,
          dataSays: c.dataSays,
          sourceTitle: c.sourceTitle,
          sourceYear: c.sourceYear,
          conflictStrength: c.conflictStrength,
        }));

        setClaims(newClaims);
        setContradictions(newContradictions);
        setRebuttal(result.rebuttal ?? "");
        setAudioUrl(result.audioUrl ?? "");

        // Cache for lookup
        analysisDetailsCache.set(analysisId, {
          claims: newClaims,
          contradictions: newContradictions,
          rebuttal: result.rebuttal ?? "",
          audioUrl: result.audioUrl ?? "",
        });

        // Deduct tokens
        updateTokens(-50);

        const tx: SolanaTransaction = {
          id: `tx-${Date.now()}`,
          type: "debit",
          amount: 50,
          description: `Analysis: ${result.title ?? newAnalysis.title}`,
          timestamp: new Date().toISOString(),
          signature: generateTxSignature(),
          status: "confirmed",
        };
        setTransactions((prev) => [tx, ...prev]);

        // Set final status
        setProcessingStatus("complete");
        setProcessingProgress(100);

        // Small delay then reset to idle so processing page navigates
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProcessingStatus("idle");

        return analysisId;
      } catch (err: any) {
        console.error("Analysis failed:", err);
        setProcessingStatus("error");
        setAnalyses((prev) =>
          prev.map((a) => (a.id === analysisId ? { ...a, status: "error" as const } : a))
        );
        return null;
      }
    },
    [user, updateTokens]
  );

  const getAnalysisById = useCallback(
    (id: string) => analyses.find((a) => a.id === id),
    [analyses]
  );

  const getClaimsForAnalysis = useCallback(
    (id: string) => analysisDetailsCache.get(id)?.claims ?? claims,
    [claims]
  );

  const getContradictionsForAnalysis = useCallback(
    (id: string) => analysisDetailsCache.get(id)?.contradictions ?? contradictions,
    [contradictions]
  );

  const getRebuttalForAnalysis = useCallback(
    (id: string) => analysisDetailsCache.get(id)?.rebuttal ?? rebuttal,
    [rebuttal]
  );

  const getAudioUrlForAnalysis = useCallback(
    (id: string) => analysisDetailsCache.get(id)?.audioUrl ?? audioUrl,
    [audioUrl]
  );

  const deleteAllHistory = useCallback(() => {
    setAnalyses([]);
    setTransactions([]);
    analysisDetailsCache.clear();
  }, []);

  return (
    <AnalysisStoreContext.Provider
      value={{
        analyses,
        claims,
        contradictions,
        rebuttal,
        transactions,
        currentAnalysisId,
        processingStatus,
        processingProgress,
        audioUrl,
        startAnalysis,
        getAnalysisById,
        deleteAllHistory,
        getClaimsForAnalysis,
        getContradictionsForAnalysis,
        getRebuttalForAnalysis,
        getAudioUrlForAnalysis,
      }}
    >
      {children}
    </AnalysisStoreContext.Provider>
  );
}

const DEFAULT_STORE: AnalysisStoreContextValue = {
  analyses: [],
  claims: [],
  contradictions: [],
  rebuttal: "",
  transactions: [],
  currentAnalysisId: null,
  processingStatus: "idle",
  processingProgress: 0,
  audioUrl: "",
  startAnalysis: async () => null,
  getAnalysisById: () => undefined,
  deleteAllHistory: () => {},
  getClaimsForAnalysis: () => [],
  getContradictionsForAnalysis: () => [],
  getRebuttalForAnalysis: () => "",
  getAudioUrlForAnalysis: () => "",
};

export function useAnalysisStore() {
  const ctx = useContext(AnalysisStoreContext);
  return ctx ?? DEFAULT_STORE;
}

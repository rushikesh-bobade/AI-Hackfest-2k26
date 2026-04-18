import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Analysis, AnalysisStatus, Claim, ContradictionEntry, SolanaTransaction } from "~/data/types";
import { ANALYSIS_STEPS } from "~/data/types";
import {
  MOCK_ANALYSES,
  MOCK_CLAIMS,
  MOCK_CONTRADICTIONS,
  MOCK_REBUTTAL,
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
  startAnalysis: (file: File) => Promise<string | null>;
  getAnalysisById: (id: string) => Analysis | undefined;
  deleteAllHistory: () => void;
}

const AnalysisStoreContext = createContext<AnalysisStoreContextValue | null>(null);

export function AnalysisStoreProvider({ children }: { children: ReactNode }) {
  const { user, updateTokens } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>(MOCK_ANALYSES);
  const [claims] = useState<Claim[]>(MOCK_CLAIMS);
  const [contradictions] = useState<ContradictionEntry[]>(MOCK_CONTRADICTIONS);
  const [rebuttal] = useState(MOCK_REBUTTAL);
  const [transactions, setTransactions] = useState<SolanaTransaction[]>(MOCK_TRANSACTIONS);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<AnalysisStatus>("idle");
  const [processingProgress, setProcessingProgress] = useState(0);

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
        wordCount: Math.floor(Math.random() * 15000) + 5000,
        claimCount: 0,
        rebuttalSnippet: "",
        status: "uploading",
        credibilityScore: 0,
        tokensCost: 50,
        fileName: file.name,
      };

      setAnalyses((prev) => [newAnalysis, ...prev]);

      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        const step = ANALYSIS_STEPS[i];
        setProcessingStatus(step.status);
        setProcessingProgress(Math.round(((i + 1) / ANALYSIS_STEPS.length) * 100));

        setAnalyses((prev) =>
          prev.map((a) => (a.id === analysisId ? { ...a, status: step.status } : a))
        );

        if (step.duration > 0) {
          await new Promise((resolve) => setTimeout(resolve, step.duration));
        }
      }

      const credibilityScore = Math.floor(Math.random() * 60) + 15;
      const claimCount = Math.floor(Math.random() * 5) + 3;

      setAnalyses((prev) =>
        prev.map((a) =>
          a.id === analysisId
            ? {
                ...a,
                status: "complete" as const,
                credibilityScore,
                claimCount,
                rebuttalSnippet:
                  "This paper has been thoroughly dissected and found wanting in several critical areas...",
              }
            : a
        )
      );

      updateTokens(-50);

      const tx: SolanaTransaction = {
        id: `tx-${Date.now()}`,
        type: "debit",
        amount: 50,
        description: `Analysis: ${newAnalysis.title}`,
        timestamp: new Date().toISOString(),
        signature: generateTxSignature(),
        status: "confirmed",
      };
      setTransactions((prev) => [tx, ...prev]);

      setProcessingStatus("idle");
      return analysisId;
    },
    [user, updateTokens]
  );

  const getAnalysisById = useCallback(
    (id: string) => analyses.find((a) => a.id === id),
    [analyses]
  );

  const deleteAllHistory = useCallback(() => {
    setAnalyses([]);
    setTransactions([]);
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
        startAnalysis,
        getAnalysisById,
        deleteAllHistory,
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
  startAnalysis: async () => null,
  getAnalysisById: () => undefined,
  deleteAllHistory: () => {},
};

export function useAnalysisStore() {
  const ctx = useContext(AnalysisStoreContext);
  return ctx ?? DEFAULT_STORE;
}

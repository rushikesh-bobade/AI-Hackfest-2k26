import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface GeminiAnalysisResult {
  title: string;
  authors: string[];
  wordCount: number;
  summary: string;
  credibilityScore: number;
  claims: {
    id: string;
    text: string;
    section: string;
    fallacy: string | null;
    severity: "low" | "medium" | "high";
    confidence: number;
  }[];
  contradictions: {
    claimId: string;
    paperSays: string;
    dataSays: string;
    sourceTitle: string;
    sourceYear: number;
    conflictStrength: number;
  }[];
  rebuttal: string;
}

const ANALYSIS_PROMPT = `You are PaperShredder AI, a brutally honest and witty academic peer reviewer. You have a PhD in everything and zero patience for sloppy research.

Analyze this academic paper PDF and return ONLY a valid JSON object (no markdown code fences, no extra text) with exactly this structure:

{
  "title": "The paper's actual title",
  "authors": ["Author 1", "Author 2"],
  "wordCount": approximate_word_count_as_number,
  "summary": "A concise 2-3 sentence summary of the paper's main argument and findings",
  "credibilityScore": number_between_0_and_100,
  "claims": [
    {
      "id": "claim-001",
      "text": "The exact or paraphrased claim from the paper",
      "section": "Section name/number where the claim appears",
      "fallacy": "Type of logical fallacy if any, or null",
      "severity": "low or medium or high",
      "confidence": number_between_0_and_100
    }
  ],
  "contradictions": [
    {
      "claimId": "claim-001",
      "paperSays": "What the paper claims",
      "dataSays": "What published research or established data actually shows",
      "sourceTitle": "Name of the contradicting source (use real or highly plausible sources)",
      "sourceYear": year_as_number,
      "conflictStrength": number_between_0_and_100
    }
  ],
  "rebuttal": "A 3-5 paragraph witty, sarcastic but scientifically rigorous peer review. Be savage but fair. Use academic humor and intellectual snark. Reference specific methodological flaws. Make it entertaining to read."
}

Requirements:
- Extract at LEAST 3-5 distinct claims from the paper
- Find at LEAST 2-3 contradictions with real or plausible academic sources
- The credibility score should reflect actual quality: 0-30 = poor, 30-50 = questionable, 50-70 = decent, 70-100 = solid
- The rebuttal must be entertaining, specific to THIS paper, and scientifically substantive
- Return ONLY the JSON object, no other text`;

export async function analyzePaper(pdfBuffer: Buffer): Promise<GeminiAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const base64Pdf = pdfBuffer.toString("base64");

  const contentParts = [
    {
      inlineData: {
        data: base64Pdf,
        mimeType: "application/pdf" as const,
      },
    },
    { text: ANALYSIS_PROMPT },
  ];

  // Retry with backoff for rate limits (free tier has strict quotas)
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [15_000, 30_000, 60_000]; // 15s, 30s, 60s

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        const delay = RETRY_DELAYS[attempt - 1] ?? 60_000;
        console.log(`[Gemini] Rate limited. Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES + 1})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const result = await model.generateContent(contentParts);
      const response = result.response;
      const text = response.text();

      // Clean potential markdown code fences from the response
      const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned) as GeminiAnalysisResult;

      // Validate & normalize
      parsed.credibilityScore = Math.max(0, Math.min(100, parsed.credibilityScore ?? 50));
      parsed.claims = (parsed.claims ?? []).map((c, i) => ({
        ...c,
        id: c.id || `claim-${String(i + 1).padStart(3, "0")}`,
        severity: (["low", "medium", "high"].includes(c.severity) ? c.severity : "medium") as "low" | "medium" | "high",
        confidence: Math.max(0, Math.min(100, c.confidence ?? 75)),
      }));
      parsed.contradictions = (parsed.contradictions ?? []).map((c) => ({
        ...c,
        conflictStrength: Math.max(0, Math.min(100, c.conflictStrength ?? 70)),
      }));

      return parsed;
    } catch (e: any) {
      lastError = e;
      // If it's a rate limit error (429), retry
      if (e?.status === 429 || e?.message?.includes("429") || e?.message?.includes("Too Many Requests")) {
        if (attempt < MAX_RETRIES) continue;
      }
      // If it's a JSON parse error, log and throw
      if (e instanceof SyntaxError) {
        console.error("Failed to parse Gemini response:", e.message);
        throw new Error("Gemini returned invalid JSON.");
      }
      // Other errors — throw immediately
      throw e;
    }
  }

  throw lastError ?? new Error("Gemini analysis failed after all retries.");
}

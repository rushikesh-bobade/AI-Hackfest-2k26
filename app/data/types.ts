export type AnalysisStatus = "idle" | "uploading" | "extracting" | "cross-referencing" | "generating" | "narrating" | "complete" | "error";

export interface User {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  tokensRemaining: number;
  tokensUsed: number;
  tier: "free" | "researcher" | "institution";
  joinedAt: string;
}

export interface Analysis {
  id: string;
  title: string;
  authors: string[];
  uploadDate: string;
  wordCount: number;
  claimCount: number;
  rebuttalSnippet: string;
  status: AnalysisStatus;
  credibilityScore: number;
  tokensCost: number;
  fileName?: string;
}

export interface Claim {
  id: string;
  text: string;
  section: string;
  fallacy?: string;
  severity: "low" | "medium" | "high";
  confidence: number;
}

export interface ContradictionEntry {
  paperId: string;
  claimId: string;
  paperSays: string;
  dataSays: string;
  sourceTitle: string;
  sourceYear: number;
  conflictStrength: number;
}

export interface SolanaTransaction {
  id: string;
  type: "debit" | "credit";
  amount: number;
  description: string;
  timestamp: string;
  signature: string;
  status: "confirmed" | "pending" | "failed";
}

export interface RateLimitInfo {
  tokensRemaining: number;
  tokensUsed: number;
  dailyLimit: number;
  dailyUsed: number;
  resetAt: string;
}

export const ANALYSIS_STEPS: { status: AnalysisStatus; label: string; duration: number }[] = [
  { status: "uploading", label: "Uploading PDF...", duration: 1500 },
  { status: "extracting", label: "Extracting claims with Gemini 1.5 Pro...", duration: 3000 },
  { status: "cross-referencing", label: "Cross-referencing via Snowflake Cortex...", duration: 2500 },
  { status: "generating", label: "Generating savage peer review...", duration: 2000 },
  { status: "narrating", label: "Synthesizing audio with ElevenLabs...", duration: 1500 },
  { status: "complete", label: "Analysis complete!", duration: 0 },
];

import type { Analysis, Claim, ContradictionEntry, User, SolanaTransaction } from "./types";

export const DEMO_USER: User = {
  id: "user-demo-001",
  email: "demo@papershredder.ai",
  name: "Dr. Demo Reviewer",
  walletAddress: "7xKP...m4Qz",
  tokensRemaining: 4750,
  tokensUsed: 250,
  tier: "researcher",
  joinedAt: "2026-03-01T00:00:00Z",
};

export const DEMO_CREDENTIALS = {
  email: "demo@papershredder.ai",
  password: "shredder2026",
};

export const TIER_LIMITS = {
  free: { dailyLimit: 3, tokenAllocation: 1000, costPerAnalysis: 100 },
  researcher: { dailyLimit: 20, tokenAllocation: 5000, costPerAnalysis: 50 },
  institution: { dailyLimit: 100, tokenAllocation: 25000, costPerAnalysis: 25 },
};

export const MOCK_ANALYSES: Analysis[] = [
  {
    id: "analysis-001",
    title: "The Impact of Social Media on Academic Performance: A Comprehensive Study",
    authors: ["Dr. Jane Overfit", "Prof. Mark Correlation"],
    uploadDate: "2026-04-15T10:30:00Z",
    wordCount: 12450,
    claimCount: 5,
    rebuttalSnippet: "The authors seem to have confused correlation with causation so thoroughly that one wonders if they've ever taken Statistics 101...",
    status: "complete",
    credibilityScore: 32,
    tokensCost: 50,
    fileName: "social-media-academic.pdf",
  },
  {
    id: "analysis-002",
    title: "Quantum Entanglement as a Mechanism for Consciousness: New Evidence",
    authors: ["Dr. Q. Pseudoscience", "Dr. I. Wishfulthinking"],
    uploadDate: "2026-04-12T14:15:00Z",
    wordCount: 8920,
    claimCount: 4,
    rebuttalSnippet: "This paper boldly goes where no peer-reviewed research has gone before \u2014 and for good reason...",
    status: "complete",
    credibilityScore: 18,
    tokensCost: 50,
    fileName: "quantum-consciousness.pdf",
  },
  {
    id: "analysis-003",
    title: "Coffee Consumption Reduces All-Cause Mortality: A Meta-Analysis",
    authors: ["Dr. C. Aholic", "Prof. B. Rew"],
    uploadDate: "2026-04-10T09:00:00Z",
    wordCount: 15600,
    claimCount: 6,
    rebuttalSnippet: "Ah, yet another coffee study. The authors cherry-pick 14 studies from a pool of 847, which is impressive selective blindness...",
    status: "complete",
    credibilityScore: 45,
    tokensCost: 50,
    fileName: "coffee-mortality.pdf",
  },
  {
    id: "analysis-004",
    title: "Remote Work and Productivity: A Longitudinal Study During Global Disruption",
    authors: ["Dr. H. Remote", "Dr. S. Office"],
    uploadDate: "2026-04-08T11:45:00Z",
    wordCount: 9800,
    claimCount: 3,
    rebuttalSnippet: "The authors define 'productivity' in seventeen different ways throughout the paper, settling on whichever definition supports their conclusion...",
    status: "complete",
    credibilityScore: 54,
    tokensCost: 50,
    fileName: "remote-work-productivity.pdf",
  },
  {
    id: "analysis-005",
    title: "Machine Learning Approaches to Climate Prediction: Overfitting the Atmosphere",
    authors: ["Dr. O. Verfit", "Prof. N. Neuralnet"],
    uploadDate: "2026-04-05T16:20:00Z",
    wordCount: 18200,
    claimCount: 7,
    rebuttalSnippet: "With a model containing more parameters than data points, the authors have essentially memorized the weather rather than predicted it...",
    status: "complete",
    credibilityScore: 27,
    tokensCost: 50,
    fileName: "ml-climate.pdf",
  },
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: "claim-001",
    text: "Students who use social media more than 3 hours per day show a 23% decrease in GPA compared to non-users.",
    section: "Results, Section 3.2",
    fallacy: "Correlation-Causation",
    severity: "high",
    confidence: 94,
  },
  {
    id: "claim-002",
    text: "Our intervention program reduced social media usage by 67% with no adverse psychological effects.",
    section: "Methods, Section 2.4",
    fallacy: "Small Sample Size",
    severity: "medium",
    confidence: 87,
  },
  {
    id: "claim-003",
    text: "The relationship between social media and academic performance is universal across all demographic groups.",
    section: "Discussion, Section 4.1",
    fallacy: "Overgeneralization",
    severity: "high",
    confidence: 91,
  },
  {
    id: "claim-004",
    text: "No prior research has adequately addressed the neurological mechanisms of social media addiction.",
    section: "Introduction, Section 1.2",
    fallacy: "Cherry-Picking",
    severity: "medium",
    confidence: 78,
  },
];

export const MOCK_CONTRADICTIONS: ContradictionEntry[] = [
  {
    paperId: "analysis-001",
    claimId: "claim-001",
    paperSays: "Social media use directly causes a 23% GPA decrease in college students.",
    dataSays: "A meta-analysis of 47 studies found no causal link between social media use and academic performance when controlling for pre-existing motivation levels (Chen et al., 2023).",
    sourceTitle: "Social Media and Academic Outcomes: A Systematic Review",
    sourceYear: 2023,
    conflictStrength: 92,
  },
  {
    paperId: "analysis-001",
    claimId: "claim-002",
    paperSays: "The intervention eliminated negative psychological effects of social media restriction.",
    dataSays: "Forced social media abstinence showed increased anxiety scores in 71% of participants aged 18-22, with withdrawal symptoms persisting beyond 2 weeks (Martinez & Williams, 2022).",
    sourceTitle: "Digital Detox: Psychological Consequences",
    sourceYear: 2022,
    conflictStrength: 85,
  },
  {
    paperId: "analysis-001",
    claimId: "claim-003",
    paperSays: "Effects are universal across all demographic and cultural groups.",
    dataSays: "Cross-cultural analysis demonstrates significant variance in social media impact across 31 countries, with collectivist cultures showing inverse correlations (Park et al., 2023).",
    sourceTitle: "Cultural Moderation in Digital Media Studies",
    sourceYear: 2023,
    conflictStrength: 88,
  },
];

export const MOCK_REBUTTAL = `Allow me to dissect this paper with the enthusiasm of someone who has read one too many studies on social media \u2014 which, ironically, is exactly what the authors appear to have done, albeit selectively.

The central claim that social media "causes" a 23% GPA decrease is stated with such confidence that one might momentarily forget the authors have conducted an observational study. Let me be clear: correlation coefficients are not causal arrows, no matter how aggressively you italicize them.

The methodology section deserves special recognition for its creative approach to sampling. The authors recruited participants from a single university, during finals week, using voluntary opt-in \u2014 a trifecta of sampling biases that would make any statistician weep into their SPSS manual.

Perhaps most remarkable is the authors' bold claim that their intervention program produced "no adverse psychological effects." This conclusion, drawn from a seven-item Likert scale administered immediately post-intervention (before withdrawal symptoms could manifest), represents an impressive commitment to measuring precisely what they wanted to find.

In summary: interesting hypothesis, regrettable execution. The authors are encouraged to revisit their introductory statistics coursework before their next submission. I suggest starting with the chapter on confounding variables \u2014 it's a real page-turner.`;

export const MOCK_TRANSACTIONS: SolanaTransaction[] = [
  {
    id: "tx-001",
    type: "credit",
    amount: 5000,
    description: "Researcher tier allocation",
    timestamp: "2026-03-01T00:00:00Z",
    signature: "5Kx9...Tn2p",
    status: "confirmed",
  },
  {
    id: "tx-002",
    type: "debit",
    amount: 50,
    description: "Analysis: Social Media & Academic Performance",
    timestamp: "2026-04-15T10:30:00Z",
    signature: "3Mv7...Rq8j",
    status: "confirmed",
  },
  {
    id: "tx-003",
    type: "debit",
    amount: 50,
    description: "Analysis: Quantum Consciousness",
    timestamp: "2026-04-12T14:15:00Z",
    signature: "8Ln4...Wp5k",
    status: "confirmed",
  },
  {
    id: "tx-004",
    type: "debit",
    amount: 50,
    description: "Analysis: Coffee & Mortality",
    timestamp: "2026-04-10T09:00:00Z",
    signature: "2Yb6...Xt9m",
    status: "confirmed",
  },
  {
    id: "tx-005",
    type: "debit",
    amount: 50,
    description: "Analysis: Remote Work Productivity",
    timestamp: "2026-04-08T11:45:00Z",
    signature: "9Qr3...Hv1n",
    status: "confirmed",
  },
  {
    id: "tx-006",
    type: "debit",
    amount: 50,
    description: "Analysis: ML Climate Prediction",
    timestamp: "2026-04-05T16:20:00Z",
    signature: "6Fd8...Jk4p",
    status: "confirmed",
  },
];

export function generateAnalysisId(): string {
  return `analysis-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function generateTxSignature(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let sig = "";
  for (let i = 0; i < 8; i++) sig += chars[Math.floor(Math.random() * chars.length)];
  return `${sig.slice(0, 4)}...${sig.slice(4)}`;
}

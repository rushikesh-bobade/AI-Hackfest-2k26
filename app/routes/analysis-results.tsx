import type { Route } from "./+types/analysis-results";
import styles from "./analysis-results.module.css";
import { useAnalysisStore } from "~/hooks/use-analysis-store";
import { PaperSummaryCard } from "~/blocks/analysis-results/paper-summary-card";
import { CredibilityScore } from "~/blocks/analysis-results/credibility-score";
import { ExtractedClaimsSection } from "~/blocks/analysis-results/extracted-claims-section";
import { ContradictionMatrix } from "~/blocks/analysis-results/contradiction-matrix";
import { RebuttalCard } from "~/blocks/analysis-results/rebuttal-card";
import { AudioPlayerWithWaveform } from "~/blocks/analysis-results/audio-player-with-waveform";
import { ElevenLabsVoiceAgent } from "~/blocks/analysis-results/elevenlabs-voice-agent";
import { ShareResults } from "~/blocks/analysis-results/share-results";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Analysis Results — PaperShredder AI" }];
}

export default function AnalysisResultsPage({ params }: Route.ComponentProps) {
  const {
    getAnalysisById,
    getClaimsForAnalysis,
    getContradictionsForAnalysis,
    getRebuttalForAnalysis,
    getAudioUrlForAnalysis,
  } = useAnalysisStore();
  const analysis = getAnalysisById(params.analysisId);

  if (!analysis) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1>Analysis Not Found</h1>
          <p>The requested analysis does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const claims = getClaimsForAnalysis(params.analysisId);
  const contradictions = getContradictionsForAnalysis(params.analysisId);
  const rebuttal = getRebuttalForAnalysis(params.analysisId);
  const audioUrl = getAudioUrlForAnalysis(params.analysisId);

  return (
    <div className={styles.page}>
      <PaperSummaryCard analysis={analysis} />
      <CredibilityScore
        score={analysis.credibilityScore}
        claimCount={claims.length}
        contradictionCount={contradictions.length}
      />
      <ExtractedClaimsSection claims={claims} />
      <ContradictionMatrix contradictions={contradictions} />
      <RebuttalCard rebuttal={rebuttal} />
      <AudioPlayerWithWaveform rebuttal={rebuttal} audioUrl={audioUrl} />
      <ShareResults analysisId={analysis.id} title={analysis.title} score={analysis.credibilityScore} />
      
      {/* ElevenLabs Conversational AI — floating voice agent */}
      <ElevenLabsVoiceAgent
        rebuttal={rebuttal}
        paperTitle={analysis.title}
        credibilityScore={analysis.credibilityScore}
      />
    </div>
  );
}

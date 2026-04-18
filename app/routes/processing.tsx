import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2, CheckCircle, Circle, Coins } from "lucide-react";
import type { Route } from "./+types/processing";
import { useAnalysisStore } from "~/hooks/use-analysis-store";
import { ANALYSIS_STEPS } from "~/data/types";
import styles from "./processing.module.css";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Processing — PaperShredder AI" }];
}

export default function ProcessingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { processingStatus, processingProgress, currentAnalysisId } = useAnalysisStore();

  const fileName = searchParams.get("file") ?? "paper.pdf";

  useEffect(() => {
    if (processingStatus === "idle" && currentAnalysisId) {
      navigate(`/analysis/${currentAnalysisId}`);
    }
  }, [processingStatus, currentAnalysisId, navigate]);

  const currentStepIndex = ANALYSIS_STEPS.findIndex((s) => s.status === processingStatus);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconBg}>
            <Loader2 size={40} className={styles.spinIcon} />
          </div>
        </div>

        <h1 className={styles.title}>Shredding in Progress</h1>
        <p className={styles.statusText}>
          {ANALYSIS_STEPS[currentStepIndex]?.label ?? "Initializing..."}
        </p>

        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${processingProgress}%` }} />
          </div>
          <div className={styles.progressLabel}>
            <span>Step {Math.max(1, currentStepIndex + 1)} of {ANALYSIS_STEPS.length}</span>
            <span>{processingProgress}%</span>
          </div>
        </div>

        <div className={styles.steps}>
          {ANALYSIS_STEPS.map((step, i) => {
            const isDone = i < currentStepIndex;
            const isActive = i === currentStepIndex;
            return (
              <div
                key={step.status}
                className={`${styles.step} ${isActive ? styles.stepActive : ""} ${isDone ? styles.stepDone : ""}`}
              >
                <span className={styles.stepIcon}>
                  {isDone ? (
                    <CheckCircle size={16} />
                  ) : isActive ? (
                    <Loader2 size={16} className={styles.spinIcon} />
                  ) : (
                    <Circle size={16} />
                  )}
                </span>
                {step.label}
              </div>
            );
          })}
        </div>

        <p className={styles.fileName}>{fileName}</p>
        <div className={styles.solanaTag}>
          <Coins size={12} />
          50 SHRED tokens will be deducted on completion
        </div>
      </div>
    </div>
  );
}

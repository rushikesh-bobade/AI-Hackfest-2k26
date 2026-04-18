import { ShieldCheck } from "lucide-react";
import classnames from "classnames";
import styles from "./credibility-score.module.css";

interface CredibilityScoreProps {
  score: number;
  claimCount: number;
  contradictionCount: number;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score <= 30) return "#ef4444";
  if (score <= 50) return "#f59e0b";
  if (score <= 70) return "#3b82f6";
  return "#22c55e";
}

function getVerdict(score: number): { label: string; description: string } {
  if (score <= 20)
    return {
      label: "Shredded Beyond Recognition",
      description: "This paper has critical methodological flaws, unsupported claims, and significant contradictions with existing literature.",
    };
  if (score <= 40)
    return {
      label: "Severely Compromised",
      description: "Multiple fallacies detected. The conclusions are questionable and the methodology needs significant revision.",
    };
  if (score <= 60)
    return {
      label: "Needs Major Revision",
      description: "Some valid points but undermined by selective evidence and methodological weaknesses.",
    };
  if (score <= 80)
    return {
      label: "Mostly Sound",
      description: "Generally well-constructed with minor issues. Could benefit from broader evidence consideration.",
    };
  return {
    label: "Academically Robust",
    description: "Well-supported claims with sound methodology. Minor suggestions for improvement.",
  };
}

export function CredibilityScore({ score, claimCount, contradictionCount, className }: CredibilityScoreProps) {
  const color = getScoreColor(score);
  const verdict = getVerdict(score);
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={classnames(styles.card, className)}>
      <div className={styles.scoreWrapper}>
        <svg className={styles.scoreRing} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" className={styles.ringBg} />
          <circle
            cx="60"
            cy="60"
            r="50"
            className={styles.ringFill}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={styles.scoreLabel}>
          <span className={styles.scoreValue} style={{ color }}>{score}</span>
          <span className={styles.scoreMax}>/100</span>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <div className={styles.headerIcon}><ShieldCheck size={18} /></div>
          <h2 className={styles.title}>Research Integrity Index</h2>
        </div>
        <p className={styles.verdict} style={{ color }}>{verdict.label}</p>
        <p className={styles.verdictText}>{verdict.description}</p>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Claims</span>
            <span className={styles.metricValue} style={{ color: "var(--color-text-primary)" }}>{claimCount}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Contradictions</span>
            <span className={styles.metricValue} style={{ color: "var(--color-error)" }}>{contradictionCount}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Integrity</span>
            <span className={styles.metricValue} style={{ color }}>{score}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

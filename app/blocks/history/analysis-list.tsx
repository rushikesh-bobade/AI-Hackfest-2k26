import { Link } from "react-router";
import { ChevronRight, Coins } from "lucide-react";
import classnames from "classnames";
import type { Analysis } from "~/data/types";
import styles from "./analysis-list.module.css";

interface AnalysisListProps {
  analyses: Analysis[];
  className?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getScoreColor(score: number): string {
  if (score <= 30) return "var(--color-error)";
  if (score <= 50) return "var(--color-warning)";
  return "var(--color-success)";
}

function getStatusLabel(status: string): string {
  if (status === "complete") return "Complete";
  if (status === "error") return "Failed";
  return "Processing...";
}

export function AnalysisList({ analyses, className }: AnalysisListProps) {
  if (analyses.length === 0) {
    return <div className={classnames(styles.empty, className)}>// No analyses found</div>;
  }

  return (
    <div className={classnames(styles.list, className)}>
      {analyses.map((analysis, i) => (
        <Link key={analysis.id} to={`/analysis/${analysis.id}`} className={styles.row}>
          <span className={styles.indexNum}>{String(i + 1).padStart(2, "0")}</span>
          <div className={styles.info}>
            <div className={styles.title}>{analysis.title}</div>
            <div className={styles.meta}>
              <span>{formatDate(analysis.uploadDate)}</span>
              <span className={styles.dot} />
              <span>{analysis.wordCount.toLocaleString()} words</span>
              <span className={styles.dot} />
              <span>{analysis.claimCount} claims</span>
              <span className={styles.dot} />
              <span>{analysis.authors[0]}</span>
            </div>
          </div>
          <div className={styles.scoreCol}>
            <span className={styles.statusLabel}>{getStatusLabel(analysis.status)}</span>
            {analysis.status === "complete" && (
              <span className={styles.score} style={{ color: getScoreColor(analysis.credibilityScore) }}>
                {analysis.credibilityScore}/100
              </span>
            )}
          </div>
          <span className={styles.tokenCost}>
            <Coins size={10} />
            {analysis.tokensCost}
          </span>
          <ChevronRight size={16} className={styles.arrow} />
        </Link>
      ))}
    </div>
  );
}

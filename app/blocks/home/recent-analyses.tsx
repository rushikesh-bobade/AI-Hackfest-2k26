import { Link } from "react-router";
import { ArrowRight, BookOpen, Coins } from "lucide-react";
import classnames from "classnames";
import { useAnalysisStore } from "~/hooks/use-analysis-store";
import styles from "./recent-analyses.module.css";

interface RecentAnalysesProps {
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

export function RecentAnalyses({ className }: RecentAnalysesProps) {
  const { analyses } = useAnalysisStore();
  const recent = analyses.filter((a) => a.status === "complete").slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <section className={classnames(styles.section, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Analyses</h2>
        <Link to="/history" className={styles.viewAll}>
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className={styles.grid}>
        {recent.map((analysis) => (
          <div key={analysis.id} className={styles.card}>
            <div className={styles.cardMeta}>
              <BookOpen size={12} />
              <span>{formatDate(analysis.uploadDate)}</span>
              <span className={styles.dot} />
              <span>{analysis.wordCount.toLocaleString()} words</span>
              <span className={styles.dot} />
              <span>{analysis.claimCount} claims</span>
            </div>
            <h3 className={styles.cardTitle}>{analysis.title}</h3>
            <p className={styles.cardAuthors}>{analysis.authors.join(", ")}</p>
            <div className={styles.cardScore}>
              <span className={styles.scoreLabel}>Integrity:</span>
              <span className={styles.scoreValue} style={{ color: getScoreColor(analysis.credibilityScore) }}>
                {analysis.credibilityScore}/100
              </span>
              <span className={styles.tokenCost}>
                <Coins size={10} />
                {analysis.tokensCost} SHRED
              </span>
            </div>
            <p className={styles.rebuttalSnippet}>"{analysis.rebuttalSnippet}"</p>
            <div className={styles.cardFooter}>
              <Link to={`/analysis/${analysis.id}`} className={styles.viewBtn}>
                View Rebuttal <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

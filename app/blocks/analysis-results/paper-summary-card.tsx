import { FileText, Calendar, Hash, Download, Coins } from "lucide-react";
import classnames from "classnames";
import type { Analysis } from "~/data/types";
import styles from "./paper-summary-card.module.css";

interface PaperSummaryCardProps {
  analysis: Analysis;
  className?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function PaperSummaryCard({ analysis, className }: PaperSummaryCardProps) {
  return (
    <div className={classnames(styles.card, className)}>
      <div className={styles.info}>
        <div className={styles.label}>
          <FileText size={12} />
          Academic Paper Analysis
        </div>
        <h1 className={styles.title}>{analysis.title}</h1>
        <p className={styles.authors}>{analysis.authors.join("; ")}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Calendar size={12} />
            {formatDate(analysis.uploadDate)}
          </span>
          <span className={styles.metaItem}>
            <Hash size={12} />
            {analysis.wordCount.toLocaleString()} words
          </span>
          <span className={styles.metaItem}>
            <FileText size={12} />
            {analysis.claimCount} claims extracted
          </span>
          <span className={styles.metaItem}>
            <Coins size={12} />
            {analysis.tokensCost} SHRED
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={classnames(styles.btn, styles.btnPrimary)}>
          <Download size={14} />
          Export PDF
        </button>
        <button className={classnames(styles.btn, styles.btnOutline)}>
          View Original
        </button>
      </div>
    </div>
  );
}

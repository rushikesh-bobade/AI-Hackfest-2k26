import { useState } from "react";
import { Share2, Copy, CheckCircle, Link as LinkIcon, Download } from "lucide-react";
import classnames from "classnames";
import styles from "./share-results.module.css";

interface ShareResultsProps {
  analysisId: string;
  title: string;
  score: number;
  className?: string;
}

export function ShareResults({ analysisId, title, score, className }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/analysis/${analysisId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyReport = () => {
    const report = `PaperShredder AI Report\n\nTitle: ${title}\nResearch Integrity Index: ${score}/100\nFull Report: ${shareUrl}`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={classnames(styles.card, className)}>
      <div className={styles.header}>
        <div className={styles.headerIcon}><Share2 size={18} /></div>
        <h2 className={styles.title}>Share Results</h2>
      </div>

      <div className={styles.actions}>
        <button className={classnames(styles.btn, copied && styles.btnCopied)} onClick={handleCopyLink}>
          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <button className={styles.btn} onClick={handleCopyReport}>
          <Download size={14} />
          Copy Report
        </button>
      </div>

      <div className={styles.shareUrl}>
        <LinkIcon size={14} />
        <span className={styles.shareUrlText}>{shareUrl}</span>
      </div>
    </div>
  );
}

import { Shield, CheckCircle } from "lucide-react";
import classnames from "classnames";
import { useAnalysisStore } from "~/hooks/use-analysis-store";
import styles from "./data-privacy.module.css";

const POLICIES = [
  "Uploaded PDFs are processed in memory and never stored on our servers.",
  "Analysis results are retained for 90 days before automatic deletion.",
  "No personal data is shared with third-party services beyond API calls.",
  "All API communications are encrypted in transit via TLS 1.3.",
  "Rate limiting enforced via Solana smart contract on Devnet.",
];

interface DataPrivacyProps {
  className?: string;
}

export function DataPrivacy({ className }: DataPrivacyProps) {
  const { deleteAllHistory } = useAnalysisStore();

  const handleDelete = () => {
    if (confirm("Are you sure? This will permanently delete all analysis history.")) {
      deleteAllHistory();
    }
  };

  return (
    <div className={classnames(styles.card, className)}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}><Shield size={18} /></div>
        <h2 className={styles.cardTitle}>Data &amp; Privacy</h2>
      </div>
      <p className={styles.info}>
        PaperShredder AI is designed with privacy in mind. Your uploaded papers are analyzed
        ephemerally and we never train AI models on your data.
      </p>
      <div className={styles.policyList}>
        {POLICIES.map((p, i) => (
          <div key={i} className={styles.policyItem}>
            <CheckCircle size={16} className={styles.policyIcon} />
            <span>{p}</span>
          </div>
        ))}
      </div>
      <div className={styles.dangerZone}>
        <div className={styles.dangerText}>
          <div className={styles.dangerTitle}>Delete All History</div>
          Permanently remove all analysis records and transaction history.
        </div>
        <button className={styles.deleteBtn} onClick={handleDelete}>Delete History</button>
      </div>
    </div>
  );
}

import { AlertTriangle, BookOpen } from "lucide-react";
import classnames from "classnames";
import type { Claim } from "~/data/types";
import styles from "./extracted-claims-section.module.css";

interface ExtractedClaimsSectionProps {
  claims: Claim[];
  className?: string;
}

function SeverityBadge({ severity }: { severity: Claim["severity"] }) {
  const map = {
    high: styles.badgeHigh,
    medium: styles.badgeMedium,
    low: styles.badgeLow,
  };
  return (
    <span className={classnames(styles.badge, map[severity])}>
      <AlertTriangle size={10} />
      {severity.charAt(0).toUpperCase() + severity.slice(1)} Risk
    </span>
  );
}

export function ExtractedClaimsSection({ claims, className }: ExtractedClaimsSectionProps) {
  return (
    <div className={classnames(styles.section, className)}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <BookOpen size={18} />
        </div>
        <h2 className={styles.title}>Extracted Claims</h2>
        <span className={styles.subtitle}>{claims.length} claims identified</span>
      </div>
      {claims.map((claim, i) => (
        <div key={claim.id} className={styles.claimCard}>
          <div className={styles.claimHeader}>
            <span className={styles.claimIndex}>#{String(i + 1).padStart(2, "0")}</span>
            <p className={styles.claimText}>{claim.text}</p>
          </div>
          <div className={styles.badges}>
            <SeverityBadge severity={claim.severity} />
            {claim.fallacy && (
              <span className={classnames(styles.badge, styles.fallacyBadge)}>
                {claim.fallacy}
              </span>
            )}
            <span className={classnames(styles.badge, styles.confidenceBadge)}>
              {claim.confidence}% confidence
            </span>
          </div>
          <div className={styles.sectionRef}>
            <BookOpen size={10} />
            {claim.section}
          </div>
        </div>
      ))}
    </div>
  );
}

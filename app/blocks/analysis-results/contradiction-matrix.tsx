import { X, CheckCircle, GitCompare } from "lucide-react";
import classnames from "classnames";
import type { ContradictionEntry } from "~/data/types";
import styles from "./contradiction-matrix.module.css";

interface ContradictionMatrixProps {
  contradictions: ContradictionEntry[];
  className?: string;
}

export function ContradictionMatrix({ contradictions, className }: ContradictionMatrixProps) {
  return (
    <div className={classnames(styles.section, className)}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <GitCompare size={18} />
        </div>
        <h2 className={styles.title}>Contradiction Matrix</h2>
      </div>
      {contradictions.map((entry, i) => (
        <div key={i} className={styles.row}>
          <div className={classnames(styles.panel, styles.panelLeft)}>
            <div className={classnames(styles.panelLabel, styles.panelLabelLeft)}>
              <X size={12} /> The Paper Says
            </div>
            <p className={styles.panelText}>{entry.paperSays}</p>
          </div>
          <div className={styles.divider}>
            <span className={styles.vsTag}>VS</span>
            <span className={styles.conflictStrength}>{entry.conflictStrength}%</span>
          </div>
          <div className={classnames(styles.panel, styles.panelRight)}>
            <div className={classnames(styles.panelLabel, styles.panelLabelRight)}>
              <CheckCircle size={12} /> The Data Says
            </div>
            <p className={styles.panelText}>{entry.dataSays}</p>
            <p className={styles.sourceRef}>
              \u2014 {entry.sourceTitle} ({entry.sourceYear})
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

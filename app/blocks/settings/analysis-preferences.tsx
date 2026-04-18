import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import classnames from "classnames";
import styles from "./analysis-preferences.module.css";

const PREFS = [
  { key: "deep", label: "Deep Analysis Mode", desc: "Enables full 1M token context window for complete paper analysis (slower but more thorough)." },
  { key: "fallacy", label: "Logical Fallacy Detection", desc: "Flag circular reasoning, cherry-picking, p-hacking, and other methodological issues." },
  { key: "phacking", label: "P-Hacking Scanner", desc: "Specifically look for statistical manipulation and significance fishing." },
  { key: "citations", label: "Citation Integrity Check", desc: "Cross-reference cited papers against the Snowflake research database." },
];

interface AnalysisPreferencesProps {
  className?: string;
}

export function AnalysisPreferences({ className }: AnalysisPreferencesProps) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ deep: true, fallacy: true, phacking: true, citations: false });

  const toggle = (key: string) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className={classnames(styles.card, className)}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}><SlidersHorizontal size={18} /></div>
        <h2 className={styles.cardTitle}>Analysis Preferences</h2>
      </div>
      {PREFS.map(({ key, label, desc }) => (
        <div key={key} className={styles.toggle}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>{label}</span>
            <span className={styles.toggleDesc}>{desc}</span>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" className={styles.switchInput} checked={!!prefs[key]} onChange={() => toggle(key)} />
            <span className={styles.switchTrack} />
            <span className={styles.switchThumb} />
          </label>
        </div>
      ))}
    </div>
  );
}

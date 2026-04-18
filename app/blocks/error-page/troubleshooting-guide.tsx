import classnames from "classnames";
import styles from "./troubleshooting-guide.module.css";

const STEPS = [
  "Ensure your PDF is under 50MB in file size.",
  "Confirm the file is a valid, non-corrupted PDF document.",
  "Check your internet connection and try again.",
  "If the issue persists, check our API Status page for known outages.",
  "Still stuck? Contact support with your error code for priority assistance.",
];

interface TroubleshootingGuideProps {
  className?: string;
}

export function TroubleshootingGuide({ className }: TroubleshootingGuideProps) {
  return (
    <section className={classnames(styles.section, className)}>
      <h2 className={styles.title}>Troubleshooting Steps</h2>
      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <div key={i} className={styles.step}>
            <span className={styles.stepNum}>{i + 1}</span>
            <p className={styles.stepText}>{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

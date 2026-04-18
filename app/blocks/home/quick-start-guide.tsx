import { UploadCloud, Cpu, GitCompare, Volume2 } from "lucide-react";
import classnames from "classnames";
import styles from "./quick-start-guide.module.css";

const STEPS = [
  {
    number: "01",
    icon: <UploadCloud size={18} />,
    title: "Upload Your PDF",
    desc: "Drag and drop or click to upload any academic paper in PDF format. We handle up to 50MB and 1M+ tokens.",
  },
  {
    number: "02",
    icon: <Cpu size={18} />,
    title: "Gemini Extracts Claims",
    desc: "Google Gemini 1.5 Pro parses the full paper and identifies 3+ testable claims, logical fallacies, and methodological weaknesses.",
  },
  {
    number: "03",
    icon: <GitCompare size={18} />,
    title: "Snowflake Cross-References",
    desc: "Each claim is queried against our global research database using Cortex Search, surfacing contradictory findings and conflicting evidence.",
  },
  {
    number: "04",
    icon: <Volume2 size={18} />,
    title: "Receive Your Savage Review",
    desc: "A witty, condescending peer review is generated and narrated via ElevenLabs in the voice of a very annoyed professor.",
  },
];

interface QuickStartGuideProps {
  className?: string;
}

export function QuickStartGuide({ className }: QuickStartGuideProps) {
  return (
    <section className={classnames(styles.section, className)}>
      <h2 className={styles.title}>How It Works</h2>
      <div className={styles.steps}>
        {STEPS.map((step) => (
          <div key={step.number} className={styles.step}>
            <span className={styles.stepNumber}>Step {step.number}</span>
            <div className={styles.stepIcon}>{step.icon}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

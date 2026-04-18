import classnames from "classnames";
import styles from "./hero-section.module.css";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={classnames(styles.section, className)}>
      <div className={styles.badge}>
        <span className={styles.badgeDot} />
        AI-Powered Academic Deconstruction
      </div>
      <h1 className={styles.title}>
        Upload Your Paper.
        <span className={styles.titleAccent}>Get Destroyed.</span>
      </h1>
      <p className={styles.subtitle}>
        PaperShredder AI extracts testable claims, cross-references a global research database,
        and delivers a savage peer review narrated by an annoyed professor.
      </p>
      <p className={styles.tagline}>// The Skeptical Research Assistant</p>
    </section>
  );
}

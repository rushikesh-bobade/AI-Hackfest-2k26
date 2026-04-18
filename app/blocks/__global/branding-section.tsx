import classnames from "classnames";
import styles from "./branding-section.module.css";

interface BrandingSectionProps {
  className?: string;
}

export function BrandingSection({ className }: BrandingSectionProps) {
  return (
    <div className={classnames(styles.container, className)}>
      <div className={styles.logoGroup}>
        <span className={styles.logoText}>
          Paper<span className={styles.logoAccent}>Shredder</span> AI
        </span>
        <span className={styles.tagline}>The Skeptical Research Assistant</span>
      </div>
      <span className={styles.copyright}>
        &copy; {new Date().getFullYear()} PaperShredder AI. All rights reserved.
      </span>
    </div>
  );
}

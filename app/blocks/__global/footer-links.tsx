import classnames from "classnames";
import styles from "./footer-links.module.css";

interface FooterLinksProps {
  className?: string;
}

export function FooterLinks({ className }: FooterLinksProps) {
  return (
    <div className={classnames(styles.container, className)}>
      <div className={styles.links}>
        <a href="#" className={styles.link}>Documentation</a>
        <a href="#" className={styles.link}>API Reference</a>
        <a href="#" className={styles.link}>GitHub</a>
        <a href="#" className={styles.link}>Support</a>
        <a href="/settings" className={styles.link}>Settings</a>
        <span className={styles.apiStatus}>
          <span className={styles.statusDot} />
          All Systems Operational
        </span>
      </div>
    </div>
  );
}

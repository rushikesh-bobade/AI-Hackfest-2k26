import { useState, useEffect } from "react";
import classnames from "classnames";
import styles from "./status-indicator.module.css";

const STATUS_MESSAGES = [
  "Detecting Academic Dishonesty...",
  "Searching for P-Hacking...",
  "Cross-Referencing Research Database...",
  "Exposing Logical Fallacies...",
  "Generating Savage Peer Review...",
  "Interrogating Methodology...",
  "Scrutinizing Citations...",
  "Auditing Statistical Claims...",
];

interface StatusIndicatorProps {
  className?: string;
}

export function StatusIndicator({ className }: StatusIndicatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classnames(styles.container, className)}>
      <div className={styles.dot} />
      {visible && (
        <span className={styles.message} key={currentIndex}>
          {STATUS_MESSAGES[currentIndex]}
        </span>
      )}
    </div>
  );
}

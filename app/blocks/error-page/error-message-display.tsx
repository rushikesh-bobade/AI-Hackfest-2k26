import { AlertOctagon } from "lucide-react";
import classnames from "classnames";
import styles from "./error-message-display.module.css";

interface ErrorMessageDisplayProps {
  errorCode?: string;
  title?: string;
  message?: string;
  className?: string;
}

export function ErrorMessageDisplay({
  errorCode = "ERR_ANALYSIS_FAILED",
  title = "Analysis Failed",
  message = "Something went wrong while processing your paper. This could be due to an oversized PDF, an unsupported format, or a temporary service disruption.",
  className,
}: ErrorMessageDisplayProps) {
  return (
    <div className={classnames(styles.container, className)}>
      <div className={styles.iconWrapper}>
        <div className={styles.iconBg}>
          <AlertOctagon size={36} />
        </div>
      </div>
      <p className={styles.errorCode}>{errorCode}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

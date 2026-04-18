import { Link } from "react-router";
import { RefreshCw, Home, MessageCircle } from "lucide-react";
import classnames from "classnames";
import styles from "./action-buttons.module.css";

interface ActionButtonsProps {
  className?: string;
}

export function ActionButtons({ className }: ActionButtonsProps) {
  return (
    <div className={classnames(styles.container, className)}>
      <button className={classnames(styles.btn, styles.btnPrimary)} onClick={() => window.history.back()}>
        <RefreshCw size={15} />
        Retry Analysis
      </button>
      <Link to="/" className={classnames(styles.btn, styles.btnSecondary)}>
        <Home size={15} />
        Return Home
      </Link>
      <a href="mailto:support@papershredder.ai" className={classnames(styles.btn, styles.btnSecondary)}>
        <MessageCircle size={15} />
        Contact Support
      </a>
    </div>
  );
}

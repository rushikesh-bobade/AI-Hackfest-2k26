import { Link } from "react-router";
import { Shield, Coins, Clock, AlertTriangle } from "lucide-react";
import classnames from "classnames";
import { useAuth } from "~/hooks/use-auth";
import { useSolanaRateLimit } from "~/hooks/use-solana-rate-limit";
import styles from "./rate-limit-banner.module.css";

interface RateLimitBannerProps {
  className?: string;
}

export function RateLimitBanner({ className }: RateLimitBannerProps) {
  const { isAuthenticated } = useAuth();
  const { rateLimitInfo, canAnalyze } = useSolanaRateLimit();

  if (!isAuthenticated) return null;

  const isWarning = !canAnalyze;

  return (
    <div className={classnames(styles.banner, isWarning && styles.bannerWarning, className)}>
      <div className={styles.bannerIcon}>
        {isWarning ? <AlertTriangle size={18} /> : <Shield size={18} />}
      </div>
      <div className={styles.bannerContent}>
        <p className={styles.bannerTitle}>
          {isWarning ? "Rate Limit Warning" : "Solana Rate Limiter Active"}
        </p>
        <div className={styles.bannerMeta}>
          <span className={styles.bannerStat}>
            <Coins size={10} />
            <span className={styles.bannerStatValue}>{rateLimitInfo.tokensRemaining}</span> SHRED
          </span>
          <span className={styles.bannerStat}>
            <Clock size={10} />
            <span className={styles.bannerStatValue}>{rateLimitInfo.dailyUsed}/{rateLimitInfo.dailyLimit}</span> today
          </span>
        </div>
      </div>
      <Link to="/wallet" className={styles.bannerLink}>
        View Wallet
      </Link>
    </div>
  );
}

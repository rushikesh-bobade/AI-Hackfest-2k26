import type { Route } from "./+types/wallet";
import { useAuth } from "~/hooks/use-auth";
import { useAnalysisStore } from "~/hooks/use-analysis-store";
import { useSolanaRateLimit } from "~/hooks/use-solana-rate-limit";
import { Wallet, Code2, ArrowDownLeft, ArrowUpRight, Coins } from "lucide-react";
import classnames from "classnames";
import styles from "./wallet.module.css";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Wallet & Rate Limits — PaperShredder AI" }];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WalletPage() {
  const { user } = useAuth();
  const { transactions } = useAnalysisStore();
  const { rateLimitInfo, tierConfig } = useSolanaRateLimit();

  if (!user) return null;

  const usagePercent = Math.min(
    100,
    ((user.tokensUsed) / (user.tokensUsed + user.tokensRemaining)) * 100
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Solana Wallet &amp; Rate Limits</h1>
        <p className={styles.subtitle}>
          // SHRED token economy powered by Solana smart contract
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>SHRED Balance</span>
          <span className={classnames(styles.statValue, styles.statValuePrimary)}>
            {user.tokensRemaining.toLocaleString()}
          </span>
          <span className={styles.statMeta}>{tierConfig.costPerAnalysis} per analysis</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Tokens Used</span>
          <span className={styles.statValue}>{user.tokensUsed.toLocaleString()}</span>
          <span className={styles.statMeta}>lifetime usage</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Daily Analyses</span>
          <span className={classnames(styles.statValue, rateLimitInfo.dailyUsed >= rateLimitInfo.dailyLimit ? styles.statValueWarning : styles.statValueSuccess)}>
            {rateLimitInfo.dailyUsed}/{rateLimitInfo.dailyLimit}
          </span>
          <span className={styles.statMeta}>resets midnight UTC</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Tier</span>
          <span className={classnames(styles.statValue, styles.statValuePrimary)}>
            {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
          </span>
          <span className={styles.statMeta}>{user.walletAddress}</span>
        </div>
      </div>

      <div className={styles.contractSection}>
        <div className={styles.contractHeader}>
          <div className={styles.contractIcon}><Code2 size={18} /></div>
          <h2 className={styles.contractTitle}>Smart Contract</h2>
          <span className={styles.contractBadge}>
            <span className={styles.contractBadgeDot} />
            Deployed (Devnet)
          </span>
        </div>
        <div className={styles.contractDetails}>
          <div className={styles.contractItem}>
            <span className={styles.contractLabel}>Program ID</span>
            <span className={styles.contractValue}>SHRDr8tL1m2k...PprShdR4tE</span>
          </div>
          <div className={styles.contractItem}>
            <span className={styles.contractLabel}>Network</span>
            <span className={styles.contractValue}>Solana Devnet</span>
          </div>
          <div className={styles.contractItem}>
            <span className={styles.contractLabel}>Token Mint</span>
            <span className={styles.contractValue}>SHRDtkn9x2...MntAddr</span>
          </div>
          <div className={styles.contractItem}>
            <span className={styles.contractLabel}>Authority</span>
            <span className={styles.contractValue}>{user.walletAddress}</span>
          </div>
        </div>
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span>Token Usage</span>
            <span>{user.tokensUsed} / {(user.tokensUsed + user.tokensRemaining).toLocaleString()}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${usagePercent}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.txSection}>
        <div className={styles.txHeader}>
          <div className={styles.txIcon}><Wallet size={18} /></div>
          <h2 className={styles.txTitle}>Transaction History</h2>
        </div>
        {transactions.length === 0 ? (
          <div className={styles.emptyTx}>// No transactions yet</div>
        ) : (
          <div className={styles.txList}>
            {transactions.map((tx) => (
              <div key={tx.id} className={styles.txRow}>
                <span className={classnames(styles.txType, tx.type === "debit" ? styles.txDebit : styles.txCredit)}>
                  {tx.type === "debit" ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
                  {tx.type.toUpperCase()}
                </span>
                <span className={styles.txDesc}>{tx.description}</span>
                <span className={classnames(styles.txAmount, tx.type === "debit" ? styles.txAmountDebit : styles.txAmountCredit)}>
                  {tx.type === "debit" ? "-" : "+"}{tx.amount} <Coins size={10} />
                </span>
                <span className={styles.txSig}>{tx.signature}</span>
                <span className={styles.txDate}>{formatDate(tx.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

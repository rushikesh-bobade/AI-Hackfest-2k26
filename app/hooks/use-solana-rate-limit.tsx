import { useState, useCallback, useMemo } from "react";
import { useAuth } from "./use-auth";
import { TIER_LIMITS } from "~/data/mock-data";
import type { RateLimitInfo } from "~/data/types";

const DAILY_USAGE_KEY = "papershredder_daily_usage";

function getDailyUsage(): { count: number; date: string } {
  if (typeof window === "undefined") return { count: 0, date: "" };
  try {
    const raw = localStorage.getItem(DAILY_USAGE_KEY);
    if (!raw) return { count: 0, date: new Date().toDateString() };
    const data = JSON.parse(raw);
    if (data.date !== new Date().toDateString()) {
      return { count: 0, date: new Date().toDateString() };
    }
    return data;
  } catch {
    return { count: 0, date: new Date().toDateString() };
  }
}

function setDailyUsage(count: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    DAILY_USAGE_KEY,
    JSON.stringify({ count, date: new Date().toDateString() })
  );
}

export function useSolanaRateLimit() {
  const { user } = useAuth();
  const [dailyUsed, setDailyUsed] = useState(() => getDailyUsage().count);

  const tierConfig = useMemo(
    () => TIER_LIMITS[user?.tier ?? "free"],
    [user?.tier]
  );

  const canAnalyze = useMemo(() => {
    if (!user) return false;
    if (user.tokensRemaining < tierConfig.costPerAnalysis) return false;
    if (dailyUsed >= tierConfig.dailyLimit) return false;
    return true;
  }, [user, tierConfig, dailyUsed]);

  const recordUsage = useCallback(() => {
    const next = dailyUsed + 1;
    setDailyUsed(next);
    setDailyUsage(next);
  }, [dailyUsed]);

  const rateLimitInfo: RateLimitInfo = {
    tokensRemaining: user?.tokensRemaining ?? 0,
    tokensUsed: user?.tokensUsed ?? 0,
    dailyLimit: tierConfig.dailyLimit,
    dailyUsed,
    resetAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
  };

  const getRejectionReason = useCallback((): string | null => {
    if (!user) return "Please log in to analyze papers.";
    if (user.tokensRemaining < tierConfig.costPerAnalysis)
      return `Insufficient SHRED tokens. Need ${tierConfig.costPerAnalysis}, have ${user.tokensRemaining}. Top up via Solana.`;
    if (dailyUsed >= tierConfig.dailyLimit)
      return `Daily rate limit reached (${tierConfig.dailyLimit}/${tierConfig.dailyLimit}). Resets at midnight UTC. Upgrade your tier for higher limits.`;
    return null;
  }, [user, tierConfig, dailyUsed]);

  return { canAnalyze, recordUsage, rateLimitInfo, getRejectionReason, tierConfig };
}

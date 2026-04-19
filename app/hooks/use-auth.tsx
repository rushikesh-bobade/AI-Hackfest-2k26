import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "~/data/types";
import { DEMO_USER, DEMO_CREDENTIALS } from "~/data/mock-data";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateTokens: (delta: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Keep demo login as fallback
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setUser({ ...DEMO_USER });
      return { success: true };
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          walletAddress: "0x" + data.user.id.replace(/[^a-z0-9]/g, "").slice(0, 12),
          tokensRemaining: data.user.tokensRemaining ?? 5000,
          tokensUsed: data.user.tokensUsed ?? 0,
          tier: "free" as const,
          joinedAt: new Date().toISOString(),
        });
        return { success: true };
      }
      return { success: false, error: data.error ?? "Invalid credentials." };
    } catch {
      return { success: false, error: "Connection error. Please try again." };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", name, email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          walletAddress: "0x" + data.user.id.replace(/[^a-z0-9]/g, "").slice(0, 12),
          tokensRemaining: data.user.tokensRemaining ?? 5000,
          tokensUsed: data.user.tokensUsed ?? 0,
          tier: "free" as const,
          joinedAt: new Date().toISOString(),
        });
        return { success: true };
      }
      return { success: false, error: data.error ?? "Registration failed." };
    } catch {
      return { success: false, error: "Connection error. Please try again." };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateTokens = useCallback((delta: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tokensRemaining: Math.max(0, prev.tokensRemaining + delta),
        tokensUsed: prev.tokensUsed + Math.abs(delta),
      };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

const DEFAULT_AUTH: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false, error: "Auth not ready" }),
  register: async () => ({ success: false, error: "Auth not ready" }),
  logout: () => {},
  updateTokens: () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? DEFAULT_AUTH;
}

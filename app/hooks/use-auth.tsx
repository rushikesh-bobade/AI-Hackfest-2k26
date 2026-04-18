import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "~/data/types";
import { DEMO_USER, DEMO_CREDENTIALS } from "~/data/mock-data";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateTokens: (delta: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setUser({ ...DEMO_USER });
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Use demo credentials to log in." };
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

const DEFAULT_AUTH: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  login: () => ({ success: false, error: "Auth not ready" }),
  logout: () => {},
  updateTokens: () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? DEFAULT_AUTH;
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { Scissors, Mail, Lock, LogIn, AlertCircle, Shield } from "lucide-react";
import type { Route } from "./+types/login";
import { useAuth } from "~/hooks/use-auth";
import styles from "./login.module.css";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Login — PaperShredder AI" },
    { name: "description", content: "Sign in to start shredding papers." },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const result = login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error ?? "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoGroup}>
            <Scissors size={28} className={styles.logoIcon} />
            <span className={styles.logoText}>
              Paper<span className={styles.logoAccent}>Shredder</span> AI
            </span>
          </div>
          <p className={styles.subtitle}>Sign in to start your deconstruction</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={15} className={styles.inputIcon} />
              <input
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={15} className={styles.inputIcon} />
              <input
                type="password"
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Authenticating..." : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        <div className={styles.demo}>
          <p className={styles.demoTitle}>Demo Credentials</p>
          <div className={styles.demoCredentials}>
            <div>
              <span className={styles.demoLabel}>Email: </span>
              <span className={styles.demoValue}>demo@papershredder.ai</span>
            </div>
            <div>
              <span className={styles.demoLabel}>Password: </span>
              <span className={styles.demoValue}>shredder2026</span>
            </div>
          </div>
          <div className={styles.solanaNote}>
            <Shield size={12} className={styles.solanaIcon} />
            Secured with Solana smart contract rate limiting
          </div>
        </div>
      </div>
    </div>
  );
}

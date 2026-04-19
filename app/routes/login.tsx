import { useState } from "react";
import { useNavigate } from "react-router";
import { Scissors, Mail, Lock, LogIn, AlertCircle, Shield, UserPlus, User } from "lucide-react";
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
  const { login, register, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
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

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        const result = await register(name, email, password);
        if (result.success) {
          navigate("/");
        } else {
          setError(result.error ?? "Registration failed.");
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          navigate("/");
        } else {
          setError(result.error ?? "Login failed.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
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
          <p className={styles.subtitle}>
            {isSignUp ? "Create your account" : "Sign in to start your deconstruction"}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {isSignUp && (
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrapper}>
                <User size={15} className={styles.inputIcon} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
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
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading
              ? (isSignUp ? "Creating account..." : "Authenticating...")
              : isSignUp
                ? <><UserPlus size={16} /> Sign Up</>
                : <><LogIn size={16} /> Sign In</>
            }
          </button>
        </form>

        <div className={styles.demo}>
          <button
            className={styles.toggleBtn}
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            type="button"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"
            }
          </button>

          {!isSignUp && (
            <div className={styles.demoCredentials}>
              <p className={styles.demoTitle}>Demo Credentials</p>
              <div>
                <span className={styles.demoLabel}>Email: </span>
                <span className={styles.demoValue}>demo@papershredder.ai</span>
              </div>
              <div>
                <span className={styles.demoLabel}>Password: </span>
                <span className={styles.demoValue}>shredder2026</span>
              </div>
            </div>
          )}

          <div className={styles.solanaNote}>
            <Shield size={12} className={styles.solanaIcon} />
            Authentication powered by Snowflake
          </div>
        </div>
      </div>
    </div>
  );
}

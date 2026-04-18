import { Link } from "react-router";
import { Coins, LogOut, LogIn } from "lucide-react";
import classnames from "classnames";
import { useAuth } from "~/hooks/use-auth";
import styles from "./user-menu.module.css";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className={classnames(styles.container, className)}>
        <Link to="/login" className={styles.loginBtn}>
          <LogIn size={14} />
          Sign In
        </Link>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={classnames(styles.container, className)}>
      <Link to="/wallet" className={styles.tokenBadge}>
        <Coins size={12} />
        {user.tokensRemaining.toLocaleString()} SHRED
      </Link>
      <Link to="/settings" className={styles.userInfo}>
        <span className={styles.avatar}>{initials}</span>
        {user.name}
      </Link>
      <button className={styles.logoutBtn} onClick={logout} title="Sign out">
        <LogOut size={12} />
      </button>
    </div>
  );
}

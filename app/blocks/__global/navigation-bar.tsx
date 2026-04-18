import { NavLink, Link } from "react-router";
import { Scissors, Upload, History, Settings, Home, Wallet } from "lucide-react";
import classnames from "classnames";
import { useAuth } from "~/hooks/use-auth";
import { UserMenu } from "./user-menu";
import styles from "./navigation-bar.module.css";

interface NavigationBarProps {
  className?: string;
}

export function NavigationBar({ className }: NavigationBarProps) {
  const { isAuthenticated } = useAuth();

  return (
    <nav className={classnames(styles.nav, className)}>
      <Link to="/" className={styles.logo}>
        <Scissors size={22} className={styles.logoIcon} />
        <span className={styles.logoText}>
          Paper<span className={styles.logoAccent}>Shredder</span> AI
        </span>
      </Link>

      <ul className={styles.navLinks}>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => classnames(styles.navLink, { [styles.active]: isActive })}
          >
            <Home size={15} />
            Home
          </NavLink>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <NavLink
                to="/history"
                className={({ isActive }) => classnames(styles.navLink, { [styles.active]: isActive })}
              >
                <History size={15} />
                History
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wallet"
                className={({ isActive }) => classnames(styles.navLink, { [styles.active]: isActive })}
              >
                <Wallet size={15} />
                Wallet
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => classnames(styles.navLink, { [styles.active]: isActive })}
          >
            <Settings size={15} />
            Settings
          </NavLink>
        </li>
      </ul>

      <div className={styles.rightSection}>
        <UserMenu />
        {isAuthenticated && (
          <Link to="/" className={styles.uploadBtn}>
            <Upload size={15} />
            Upload Paper
          </Link>
        )}
      </div>
    </nav>
  );
}

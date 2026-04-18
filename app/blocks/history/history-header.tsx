import { Search } from "lucide-react";
import classnames from "classnames";
import styles from "./history-header.module.css";

interface HistoryHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
  totalCount: number;
  className?: string;
}

export function HistoryHeader({ search, onSearchChange, sortBy, onSortChange, totalCount, className }: HistoryHeaderProps) {
  return (
    <div className={classnames(styles.header, className)}>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.title}>Analysis History</h1>
          <p className={styles.subtitle}>{totalCount} papers analyzed</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search papers..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <select className={styles.select} value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title">By Title</option>
            <option value="score">By Integrity Score</option>
          </select>
        </div>
      </div>
    </div>
  );
}

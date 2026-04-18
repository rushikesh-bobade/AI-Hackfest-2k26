import { ChevronLeft, ChevronRight } from "lucide-react";
import classnames from "classnames";
import styles from "./pagination-controls.module.css";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({ currentPage, totalPages, onPageChange, className }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={classnames(styles.controls, className)}>
      <button className={styles.btn} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft size={14} /> Prev
      </button>
      <div className={styles.pages}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={classnames(styles.pageBtn, { [styles.active]: page === currentPage })}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button className={styles.btn} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

import { useState, useMemo } from "react";
import type { Route } from "./+types/history";
import styles from "./history.module.css";
import { HistoryHeader } from "~/blocks/history/history-header";
import { AnalysisList } from "~/blocks/history/analysis-list";
import { PaginationControls } from "~/blocks/history/pagination-controls";
import { useAnalysisStore } from "~/hooks/use-analysis-store";

const PAGE_SIZE = 5;

export function meta(_: Route.MetaArgs) {
  return [{ title: "History \u2014 PaperShredder AI" }];
}

export default function HistoryPage() {
  const { analyses } = useAnalysisStore();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = analyses.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.authors.some((au) => au.toLowerCase().includes(search.toLowerCase()))
    );
    if (sortBy === "date-asc") result = [...result].sort((a, b) => a.uploadDate.localeCompare(b.uploadDate));
    else if (sortBy === "date-desc") result = [...result].sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));
    else if (sortBy === "title") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "score") result = [...result].sort((a, b) => a.credibilityScore - b.credibilityScore);
    return result;
  }, [analyses, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <HistoryHeader
        search={search}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={analyses.length}
      />
      <AnalysisList analyses={paginated} />
      <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

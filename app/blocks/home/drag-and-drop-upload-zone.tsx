import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { UploadCloud, FileText, Zap, AlertCircle, LogIn } from "lucide-react";
import { Link } from "react-router";
import classnames from "classnames";
import { useAuth } from "~/hooks/use-auth";
import { useAnalysisStore } from "~/hooks/use-analysis-store";
import { useSolanaRateLimit } from "~/hooks/use-solana-rate-limit";
import styles from "./drag-and-drop-upload-zone.module.css";

interface DragAndDropUploadZoneProps {
  className?: string;
}

export function DragAndDropUploadZone({ className }: DragAndDropUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { startAnalysis } = useAnalysisStore();
  const { canAnalyze, recordUsage, getRejectionReason } = useSolanaRateLimit();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      setError("Only PDF files are accepted.");
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    const rejection = getRejectionReason();
    if (rejection) {
      setError(rejection);
      return;
    }

    recordUsage();
    navigate(`/processing?file=${encodeURIComponent(selectedFile.name)}`);
    const analysisId = await startAnalysis(selectedFile);
    if (!analysisId) {
      setError("Analysis failed. Please try again.");
    }
  };

  return (
    <div className={classnames(styles.container, className)}>
      <div
        className={classnames(styles.zone, { [styles.dragging]: isDragging })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
        <div className={styles.iconWrapper}>
          <UploadCloud size={48} className={styles.icon} />
        </div>
        <p className={styles.title}>
          {isDragging ? "Drop it like it's hot" : "Drop your paper here"}
        </p>
        <p className={styles.subtitle}>Drag & drop a PDF to begin the deconstruction</p>
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          or
          <span className={styles.dividerLine} />
        </div>
        <button className={styles.uploadBtn} onClick={() => inputRef.current?.click()} type="button">
          <FileText size={16} />
          Browse Files
        </button>
        <p className={styles.meta}>PDF only · Max 50MB · 50 SHRED tokens per analysis</p>

        {selectedFile && (
          <div className={styles.fileSelected}>
            <FileText size={18} color="var(--color-primary)" />
            <span className={styles.fileName}>{selectedFile.name}</span>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {selectedFile && isAuthenticated && (
        <button
          className={styles.analyzeBtn}
          onClick={handleAnalyze}
          type="button"
          disabled={!canAnalyze}
        >
          <Zap size={16} />
          Shred This Paper
        </button>
      )}

      {selectedFile && !isAuthenticated && (
        <Link to="/login" className={styles.analyzeBtn}>
          <LogIn size={16} />
          Sign In to Analyze
        </Link>
      )}
    </div>
  );
}

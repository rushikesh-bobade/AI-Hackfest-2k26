import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, FileText } from "lucide-react";
import classnames from "classnames";
import styles from "./audio-player-with-waveform.module.css";

const BAR_COUNT = 40;
const WAVE_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) =>
  Math.abs(Math.sin(i * 0.4) * 60) + 10
);

interface AudioPlayerWithWaveformProps {
  rebuttal: string;
  className?: string;
}

export function AudioPlayerWithWaveform({ rebuttal, className }: AudioPlayerWithWaveformProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return p + 0.3;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const elapsed = Math.floor((progress / 100) * 245);
  const total = 245;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className={classnames(styles.player, className)}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Volume2 size={18} />
        </div>
        <h3 className={styles.title}>Audio Narration</h3>
        <span className={styles.voiceLabel}>ElevenLabs \u2022 Antoni (Annoyed Professor)</span>
      </div>

      <div className={styles.waveform}>
        {WAVE_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={classnames(styles.bar, { [styles.active]: isPlaying })}
            style={{ height: `${h}%`, animationDelay: `${(i % 5) * 0.1}s` }}
          />
        ))}
      </div>

      <div className={styles.controls}>
        <button
          className={styles.playBtn}
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.timeLabels}>
            <span>{fmt(elapsed)}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      </div>

      <div className={styles.transcript}>
        <button className={styles.transcriptToggle} onClick={() => setShowTranscript((s) => !s)}>
          <FileText size={14} />
          {showTranscript ? "Hide" : "Show"} Transcript
        </button>
        {showTranscript && (
          <div className={styles.transcriptText}>{rebuttal}</div>
        )}
      </div>
    </div>
  );
}

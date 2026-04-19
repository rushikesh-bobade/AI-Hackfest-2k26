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
  audioUrl?: string;
  className?: string;
}

export function AudioPlayerWithWaveform({ rebuttal, audioUrl, className }: AudioPlayerWithWaveformProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasRealAudio, setHasRealAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize real audio element if we have a URL
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setHasRealAudio(true);

      audio.addEventListener("loadedmetadata", () => {
        setDuration(Math.floor(audio.duration));
      });
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(Math.floor(audio.currentTime));
        if (audio.duration > 0) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(100);
      });
      audio.addEventListener("error", () => {
        console.warn("Audio failed to load, falling back to simulation");
        setHasRealAudio(false);
        audioRef.current = null;
      });

      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, [audioUrl]);

  // Fallback: use browser speechSynthesis when no real audio
  useEffect(() => {
    if (!hasRealAudio) {
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setProgress((p) => {
            if (p >= 100) {
              setIsPlaying(false);
              return 100;
            }
            return p + 0.15;
          });
        }, 100);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isPlaying, hasRealAudio]);

  const handlePlayPause = () => {
    if (hasRealAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying((p) => !p);
      return;
    }

    // Browser native TTS fallback
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(rebuttal);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        // Try to find a good English voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) 
          ?? voices.find((v) => v.lang.startsWith("en"));
        if (englishVoice) utterance.voice = englishVoice;
        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
        };
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setProgress(0);
      }
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const displayDuration = hasRealAudio ? duration : 245;
  const displayElapsed = hasRealAudio ? currentTime : Math.floor((progress / 100) * 245);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className={classnames(styles.player, className)}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Volume2 size={18} />
        </div>
        <h3 className={styles.title}>Audio Narration</h3>
        <span className={styles.voiceLabel}>
          {hasRealAudio ? "ElevenLabs • Live Audio" : "ElevenLabs • Simulated"}
        </span>
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
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.timeLabels}>
            <span>{fmt(displayElapsed)}</span>
            <span>{fmt(displayDuration)}</span>
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

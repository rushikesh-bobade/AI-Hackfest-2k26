import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, X, Play, Pause, MessageCircle } from "lucide-react";
import classnames from "classnames";
import styles from "./elevenlabs-voice-agent.module.css";

interface ElevenLabsVoiceAgentProps {
  rebuttal: string;
  paperTitle: string;
  credibilityScore: number;
  className?: string;
}

export function ElevenLabsVoiceAgent({
  rebuttal,
  paperTitle,
  credibilityScore,
  className,
}: ElevenLabsVoiceAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(rebuttal);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google")) ??
      voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <>
      {/* Floating voice agent button */}
      <button
        className={classnames(styles.fab, { [styles.fabActive]: isOpen })}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close voice agent" : "Talk to AI reviewer"}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && <span className={styles.fabLabel}>Ask AI Reviewer</span>}
      </button>

      {/* Voice agent panel */}
      {isOpen && (
        <div className={classnames(styles.panel, className)}>
          <div className={styles.panelHeader}>
            <div className={styles.headerIcon}>
              <Volume2 size={18} />
            </div>
            <div>
              <h3 className={styles.title}>AI Voice Reviewer</h3>
              <span className={styles.subtitle}>
                "{paperTitle}" • Score: {credibilityScore}/100
              </span>
            </div>
            <button className={styles.closeBtn} onClick={() => { setIsOpen(false); window.speechSynthesis?.cancel(); setIsSpeaking(false); }}>
              <X size={16} />
            </button>
          </div>

          <div className={styles.widgetContainer}>
            <div className={styles.speakSection}>
              <button className={styles.speakBtn} onClick={handleSpeak}>
                {isSpeaking ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <p className={styles.speakLabel}>
                {isSpeaking ? "Speaking... Click to stop" : "Click to hear the AI review"}
              </p>
              <div className={styles.poweredBy}>
                <Mic size={12} />
                Powered by ElevenLabs AI
              </div>
            </div>
          </div>

          <div className={styles.transcript}>
            <button
              className={styles.transcriptToggle}
              onClick={() => setShowTranscript(!showTranscript)}
            >
              <MessageCircle size={14} />
              {showTranscript ? "Hide" : "Show"} AI Rebuttal Text
            </button>
            {showTranscript && (
              <div className={styles.transcriptText}>{rebuttal}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

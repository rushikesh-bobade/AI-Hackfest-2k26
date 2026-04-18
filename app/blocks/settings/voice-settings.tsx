import { useState } from "react";
import { Volume2 } from "lucide-react";
import classnames from "classnames";
import styles from "./voice-settings.module.css";

const VOICES = ["Antoni (Annoyed Professor)", "Bella (Skeptical Reviewer)", "Josh (Weary Academic)", "Sam (Deadpan Critic)"];

interface VoiceSettingsProps {
  className?: string;
}

export function VoiceSettings({ className }: VoiceSettingsProps) {
  const [voice, setVoice] = useState(VOICES[0]);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [intensity, setIntensity] = useState(0.8);

  return (
    <div className={classnames(styles.card, className)}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}><Volume2 size={18} /></div>
        <h2 className={styles.cardTitle}>Voice Settings</h2>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>ElevenLabs Voice</label>
        <select className={styles.select} value={voice} onChange={(e) => setVoice(e.target.value)}>
          {VOICES.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Speech Rate</label>
        <div className={styles.rangeWrapper}>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className={styles.range} />
          <span className={styles.rangeValue}>{rate.toFixed(1)}x</span>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Pitch</label>
        <div className={styles.rangeWrapper}>
          <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className={styles.range} />
          <span className={styles.rangeValue}>{pitch.toFixed(1)}</span>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Condescension Intensity</label>
        <div className={styles.rangeWrapper}>
          <input type="range" min={0} max={1} step={0.1} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className={styles.range} />
          <span className={styles.rangeValue}>{Math.round(intensity * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

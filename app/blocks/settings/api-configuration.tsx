import { Plug } from "lucide-react";
import classnames from "classnames";
import styles from "./api-configuration.module.css";

const APIS = [
  { name: "Google Gemini", desc: "Multimodal PDF analysis & rebuttal generation", status: "connected" as const },
  { name: "Snowflake Cortex", desc: "Research database (GLOBAL_RESEARCH_INDEX)", status: "connected" as const },
  { name: "ElevenLabs", desc: "Voice synthesis via WebSocket streaming", status: "connected" as const },
];

interface ApiConfigurationProps {
  className?: string;
}

export function ApiConfiguration({ className }: ApiConfigurationProps) {
  return (
    <div className={classnames(styles.card, className)}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}><Plug size={18} /></div>
        <h2 className={styles.cardTitle}>API Configuration</h2>
      </div>
      {APIS.map((api) => (
        <div key={api.name} className={styles.apiRow}>
          <div className={styles.apiInfo}>
            <span className={styles.apiName}>{api.name}</span>
            <span className={styles.apiDesc}>{api.desc}</span>
          </div>
          <div className={classnames(styles.statusBadge, api.status === "connected" ? styles.connected : styles.disconnected)}>
            <span className={styles.statusDot} />
            {api.status === "connected" ? "Connected" : "Disconnected"}
          </div>
        </div>
      ))}
    </div>
  );
}

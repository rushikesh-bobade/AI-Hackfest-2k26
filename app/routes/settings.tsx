import type { Route } from "./+types/settings";
import styles from "./settings.module.css";
import { VoiceSettings } from "~/blocks/settings/voice-settings";
import { AnalysisPreferences } from "~/blocks/settings/analysis-preferences";
import { ApiConfiguration } from "~/blocks/settings/api-configuration";
import { DataPrivacy } from "~/blocks/settings/data-privacy";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Settings — PaperShredder AI" }];
}

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>// Configure analysis preferences and integrations</p>
      </div>
      <div className={styles.grid}>
        <VoiceSettings />
        <AnalysisPreferences />
        <ApiConfiguration />
        <DataPrivacy />
      </div>
    </div>
  );
}

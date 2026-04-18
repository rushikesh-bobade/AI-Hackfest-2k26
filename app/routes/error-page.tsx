import type { Route } from "./+types/error-page";
import styles from "./error-page.module.css";
import { ErrorMessageDisplay } from "~/blocks/error-page/error-message-display";
import { TroubleshootingGuide } from "~/blocks/error-page/troubleshooting-guide";
import { ActionButtons } from "~/blocks/error-page/action-buttons";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Error — PaperShredder AI" }];
}

export default function ErrorPageRoute() {
  return (
    <div className={styles.page}>
      <ErrorMessageDisplay />
      <div className={styles.divider} />
      <TroubleshootingGuide />
      <ActionButtons />
    </div>
  );
}

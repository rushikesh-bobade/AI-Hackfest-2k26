import type { Route } from "./+types/home";
import styles from "./home.module.css";
import { HeroSection } from "~/blocks/home/hero-section";
import { DragAndDropUploadZone } from "~/blocks/home/drag-and-drop-upload-zone";
import { RateLimitBanner } from "~/blocks/home/rate-limit-banner";
import { RecentAnalyses } from "~/blocks/home/recent-analyses";
import { QuickStartGuide } from "~/blocks/home/quick-start-guide";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "PaperShredder AI \u2014 The Skeptical Research Assistant" },
    { name: "description", content: "Upload academic papers and receive a brutal, witty peer review powered by AI & Solana." },
  ];
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <RateLimitBanner />
      <DragAndDropUploadZone />
      <div className={styles.divider} />
      <RecentAnalyses />
      <div className={styles.divider} />
      <QuickStartGuide />
    </div>
  );
}

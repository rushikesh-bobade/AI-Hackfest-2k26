import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { ErrorBoundary as ErrorBoundaryRoot } from "~/components/error-boundary/error-boundary";
import { useColorScheme } from "~/hooks/use-color-scheme";
import favicon from "/favicon.svg";

import "./styles/reset.css";
import "./styles/global.css";
import "./styles/theme.css";
import styles from "./root.module.css";

import { AuthProvider } from "./hooks/use-auth";
import { AnalysisStoreProvider } from "./hooks/use-analysis-store";
import { NavigationBar } from "./blocks/__global/navigation-bar";
import { StatusIndicator } from "./blocks/__global/status-indicator";
import { FooterLinks } from "./blocks/__global/footer-links";
import { BrandingSection } from "./blocks/__global/branding-section";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: favicon, type: "image/svg+xml" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { rootCssClass, resolvedScheme } = useColorScheme();
  return (
    <html lang="en" suppressHydrationWarning className={rootCssClass} style={{ colorScheme: resolvedScheme }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider>
          <AnalysisStoreProvider>
            <div className={styles.appWrapper}>
              <header className={styles.header}>
                <NavigationBar />
                <StatusIndicator />
              </header>
              <main className={styles.main}>{children}</main>
              <footer className={styles.footer}>
                <FooterLinks />
                <BrandingSection />
              </footer>
            </div>
          </AnalysisStoreProvider>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = ErrorBoundaryRoot;

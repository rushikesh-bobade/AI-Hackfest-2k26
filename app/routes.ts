import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/analysis/:analysisId", "routes/analysis-results.tsx"),
  route("/processing", "routes/processing.tsx"),
  route("/history", "routes/history.tsx"),
  route("/wallet", "routes/wallet.tsx"),
  route("/settings", "routes/settings.tsx"),
  route("/error", "routes/error-page.tsx"),

  // API routes (server-side only)
  route("/api/analyze", "routes/api.analyze.ts"),
  route("/api/audio/:analysisId", "routes/api.audio.$analysisId.ts"),
  route("/api/history", "routes/api.history.ts"),
  route("/api/auth", "routes/api.auth.ts"),
] satisfies RouteConfig;

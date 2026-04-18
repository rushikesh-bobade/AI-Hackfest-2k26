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
] satisfies RouteConfig;

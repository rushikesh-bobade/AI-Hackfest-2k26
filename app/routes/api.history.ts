import type { Route } from "./+types/api.history";
import { getAnalysisHistory } from "~/services/snowflake.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? "user-demo-001";

  try {
    const history = await getAnalysisHistory(userId);
    return Response.json({ success: true, analyses: history });
  } catch (e: any) {
    console.error("[History] Failed:", e.message);
    return Response.json({ success: false, analyses: [] });
  }
}

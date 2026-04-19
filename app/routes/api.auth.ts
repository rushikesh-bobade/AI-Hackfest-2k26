import type { Route } from "./+types/api.auth";
import { registerUser, loginUser } from "~/services/snowflake.server";

export async function action({ request }: Route.ActionArgs) {
  const body = await request.json();
  const { action: authAction, email, password, name } = body;

  if (!email || !password) {
    return Response.json({ success: false, error: "Email and password are required." }, { status: 400 });
  }

  if (authAction === "register") {
    if (!name) {
      return Response.json({ success: false, error: "Name is required." }, { status: 400 });
    }
    const result = await registerUser(name, email, password);
    return Response.json(result, { status: result.success ? 200 : 400 });
  }

  if (authAction === "login") {
    const result = await loginUser(email, password);
    return Response.json(result, { status: result.success ? 200 : 401 });
  }

  return Response.json({ success: false, error: "Invalid action." }, { status: 400 });
}

import type { Route } from "./+types/api.audio.$analysisId";
import { getAudioBuffer } from "~/services/elevenlabs.server";

export async function loader({ params }: Route.LoaderArgs) {
  const { analysisId } = params;
  const buffer = getAudioBuffer(analysisId);

  if (!buffer) {
    return new Response("Audio not found", { status: 404 });
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.byteLength.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}

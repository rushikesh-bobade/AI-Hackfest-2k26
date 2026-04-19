function getApiKey() { return process.env.ELEVENLABS_API_KEY ?? ""; }

// Default voice — can be changed in settings later
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel

// In-memory audio cache keyed by analysisId
const audioCache = new Map<string, Buffer>();

export async function generateAudio(text: string, analysisId: string): Promise<string> {
  // Return cached URL if we already have the audio
  if (audioCache.has(analysisId)) {
    return `/api/audio/${analysisId}`;
  }

  // Truncate text to ~5000 chars to avoid very long audio
  const truncated = text.length > 5000 ? text.slice(0, 5000) + "..." : text;

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": getApiKey(),
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: truncated,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.8,
        style: 0.6,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("ElevenLabs TTS error:", response.status, errText);
    throw new Error(`ElevenLabs TTS failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Cache the audio
  audioCache.set(analysisId, buffer);

  return `/api/audio/${analysisId}`;
}

export function getAudioBuffer(analysisId: string): Buffer | null {
  return audioCache.get(analysisId) ?? null;
}

export async function listVoices(): Promise<{ voice_id: string; name: string }[]> {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": getApiKey() },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.voices ?? []).map((v: any) => ({ voice_id: v.voice_id, name: v.name }));
  } catch {
    return [];
  }
}

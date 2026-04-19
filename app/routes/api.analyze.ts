import type { Route } from "./+types/api.analyze";
import { analyzePaper } from "~/services/gemini.server";
import { generateAudio } from "~/services/elevenlabs.server";
import { saveAnalysis } from "~/services/snowflake.server";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;
    const userId = (formData.get("userId") as string) ?? "user-demo-001";
    const analysisId = (formData.get("analysisId") as string) ?? `analysis-${Date.now().toString(36)}`;

    if (!file || file.type !== "application/pdf") {
      return Response.json({ error: "A valid PDF file is required." }, { status: 400 });
    }

    // 1. Read PDF buffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // 2. Analyze with Gemini
    console.log(`[Analyze] Starting Gemini analysis for ${file.name}...`);
    const geminiResult = await analyzePaper(pdfBuffer);
    console.log(`[Analyze] Gemini done. Score: ${geminiResult.credibilityScore}, Claims: ${geminiResult.claims.length}`);

    // 3. Generate audio with ElevenLabs (non-blocking failure)
    let audioUrl = "";
    try {
      console.log("[Analyze] Generating ElevenLabs audio...");
      audioUrl = await generateAudio(geminiResult.rebuttal, analysisId);
      console.log("[Analyze] Audio generated:", audioUrl);
    } catch (e: any) {
      console.warn("[Analyze] ElevenLabs failed (non-fatal):", e.message);
    }

    // 4. Save to Snowflake (non-blocking failure)
    const rebuttalSnippet = geminiResult.rebuttal.slice(0, 200) + "...";
    try {
      console.log("[Analyze] Saving to Snowflake...");
      await saveAnalysis({
        id: analysisId,
        userId,
        title: geminiResult.title,
        authors: geminiResult.authors,
        uploadDate: new Date().toISOString(),
        wordCount: geminiResult.wordCount,
        fileName: file.name,
        credibilityScore: geminiResult.credibilityScore,
        claimCount: geminiResult.claims.length,
        tokensCost: 50,
        status: "complete",
        summary: geminiResult.summary ?? "",
        claims: geminiResult.claims,
        contradictions: geminiResult.contradictions,
        rebuttal: geminiResult.rebuttal,
        rebuttalSnippet,
        audioUrl,
      });
      console.log("[Analyze] Saved to Snowflake.");
    } catch (e: any) {
      console.warn("[Analyze] Snowflake save failed (non-fatal):", e.message);
    }

    // 5. Return full result
    return Response.json({
      success: true,
      analysisId,
      title: geminiResult.title,
      authors: geminiResult.authors,
      wordCount: geminiResult.wordCount,
      summary: geminiResult.summary,
      credibilityScore: geminiResult.credibilityScore,
      claims: geminiResult.claims,
      contradictions: geminiResult.contradictions.map((c) => ({
        ...c,
        paperId: analysisId,
      })),
      rebuttal: geminiResult.rebuttal,
      rebuttalSnippet,
      audioUrl,
      tokensCost: 50,
      status: "complete",
    });
  } catch (e: any) {
    console.error("[Analyze] Pipeline error:", e);
    return Response.json(
      { error: e.message ?? "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

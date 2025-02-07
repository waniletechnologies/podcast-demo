import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const client = new ElevenLabsClient({
    apiKey: "sk_969a9710a08e309e8e50e1eae5a542a59d3ca1d997d598ef",
  });

  try {
    const audio = await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
      text: "The first move is what sets everything in motion.",
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (error) {
    console.error("Error generating TTS:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

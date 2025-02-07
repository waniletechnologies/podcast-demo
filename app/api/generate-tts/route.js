// app/api/generate-tts/route.js
import { ElevenLabsClient } from "elevenlabs";

export async function POST(req) {
  try {
    const { text, voiceId, settings } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audio = await client.textToSpeech.convert(
      voiceId || "default-voice",
      {
        voice_settings: {
          stability: settings?.stability || 0.1,
          similarity_boost: settings?.boost || 0.85,
          speed: settings?.speed || 1.25,
          pitch: settings?.pitch || 1.4,
          style: 0.75,
          //   style: settings?.style || "angry", // Use angry style
          effects: settings?.effects || [], // Apply vocal effects
        },
        text: addAngerEmphasis(text), // Add text processing
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_44100_128",
      }
    );

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=tts.mp3",
      },
    });
  } catch (error) {
    console.error("Error generating TTS:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to add textual emphasis
function addAngerEmphasis(text) {
  return text
    .replace(/(!\s*)/g, "$1<break strength='strong'/>")
    .replace(
      /[A-Z]{2,}/g,
      (match) => `<prosody volume="loud">${match}</prosody>`
    );
}

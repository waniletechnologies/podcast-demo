"use client";
import { useConversation } from "@11labs/react";
import axios from "axios";
import { useEffect, useState } from "react";

// Voice IDs for the two agents
const AGENTS = {
  HOST: {
    id: "XgGmoMbojHY0ecPljCwP", // Eric
    name: "Host",
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
  },
  GUEST: {
    id: "FwOzWD5NwCC7f4KUT6te", // Faizan
    name: "Guest",
    voiceId: "XB0fDUnXU5powFXDhCwa",
  },
};

export function PodcastConversation() {
  const [script, setScript] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Initialize both agents
  const hostConversation = useConversation();
  const guestConversation = useConversation();

  // Enhanced anger settings
  const ANGER_SETTINGS = {
    pitch: 1.4, // Higher pitch for intensity
    speed: 1.25, // Faster speech pace
    stability: 0.1, // More vocal variability
    boost: 0.85, // Maintain clarity while emotional
    volume: 1.2, // Louder delivery
  };

  // Podcast script (could be loaded from an API or user input)
  const podcastScript = [
    {
      agent: AGENTS.HOST,
      text: "Welcome to our show! We're THRILLED to have you here.",
      emotion: {
        pitch: 1.2,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "cheerful",
      },
    },
    {
      agent: AGENTS.GUEST,
      text: "Thank you! It's a pleasure to be here.",
      emotion: {
        pitch: 1.1,
        speed: 1.0,
        stability: 0.9,
        boost: 0.9,
        volume: 1.0,
        style: "happy",
      },
    },
    {
      agent: AGENTS.HOST,
      text: "Let's dive right into the topic. What inspired you to start your journey?",
      emotion: {
        pitch: 1.0,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "curious",
      },
    },
    {
      agent: AGENTS.GUEST,
      text: "It all started with a simple idea. I wanted to make a difference.",
      emotion: {
        pitch: 1.0,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "thoughtful",
      },
    },
    {
      agent: AGENTS.HOST,
      text: "That's truly inspiring. Can you share some challenges you faced?",
      emotion: {
        pitch: 1.0,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "interested",
      },
    },
    {
      agent: AGENTS.GUEST,
      text: "There were many obstacles, but perseverance was key.",
      emotion: {
        pitch: 1.0,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "determined",
      },
    },
    {
      agent: AGENTS.HOST,
      text: "Absolutely. Overcoming challenges is part of the journey.",
      emotion: {
        pitch: 1.0,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "supportive",
      },
    },
    {
      agent: AGENTS.GUEST,
      text: "Indeed. And the support from the community has been incredible.",
      emotion: {
        pitch: 1.0,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "grateful",
      },
    },
    {
      agent: AGENTS.HOST,
      text: "We're all rooting for you. What's next on your agenda?",
      emotion: {
        pitch: 1.0,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "excited",
      },
    },
    {
      agent: AGENTS.GUEST,
      text: "I'm working on some exciting new projects. Stay tuned!",
      emotion: {
        pitch: 1.0,
        speed: 1.0,
        stability: 0.8,
        boost: 0.9,
        volume: 1.0,
        style: "enthusiastic",
      },
    },
  ];
  useEffect(() => {
    setScript(podcastScript);
  }, []);

  const startPodcast = async () => {
    setConversationHistory([]);

    try {
      for (let i = 0; i < script.length; i++) {
        setCurrentLine(i);
        const line = script[i];

        // Add to conversation history
        setConversationHistory((prev) => [
          ...prev,
          {
            speaker: line.agent.name,
            text: line.text,
          },
        ]);

        // Generate and play audio
        await playLine(line);
      }
    } catch (error) {
      console.error("Podcast error:", error);
    } finally {
      setIsPlaying(false);
      setCurrentLine(0);
    }
  };

  const playLine = async (line) => {
    try {
      const response = await axios.post(
        "/api/generate-tts",
        {
          text: line.text,
          voiceId: line.agent.voiceId,
          settings: {
            ...line.emotion,
            // Add vocal emphasis on exclamation points
            emphasis: line.text.includes("!") ? 1.4 : 1.0,
            // Add subtle growling effect for anger
            effects: [{ type: "vocal_tension", value: 0.8 }],
          },
        },
        { responseType: "arraybuffer" }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);

      // Wait for audio to finish playing
      await new Promise((resolve) => {
        audioElement.play();
        audioElement.addEventListener("ended", resolve);
      });
    } catch (error) {
      console.error("Error playing line:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        AI Podcast Demo for Bell from Wanile AI
      </h1>

      <div className="mb-4">
        <button
          onClick={startPodcast}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isPlaying}>
          {isPlaying ? "Playing..." : "Start Podcast"}
        </button>
      </div>

      <div className="mb-6 h-96 overflow-y-auto border p-4 rounded">
        {conversationHistory.map((entry, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded ${
              index === currentLine ? "bg-yellow-50" : ""
            }`}>
            <strong
              className={`text-${
                entry.speaker === "Host" ? "blue" : "green"
              }-600`}>
              {entry.speaker}:
            </strong>
            <p className="ml-2">{entry.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-gray-600">
        <p>Status: {isPlaying ? "Playing" : "Ready"}</p>
        <p>Current Speaker: {script[currentLine]?.agent.name || "None"}</p>
      </div>
    </div>
  );
}

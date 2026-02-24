import "dotenv/config";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { CHARACTERS } from "./characterData.js";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error(
    "Error: ELEVENLABS_API_KEY is not set in .env or environment variables.",
  );
  process.exit(1);
}

// Simple mapping for default voices (using common ElevenLabs voice IDs if possible, or querying list)
// These are some standard ElevenLabs public voices roughly matched by gender/tone
const VOICE_MAPPING = {
  "Male Deep": "ErXwobaYiN019PkySvjV", // Antoni (American, Deep)
  "Female Sultry": "21m00Tcm4TlvDq8ikWAM", // Rachel (American, Calm)
  "Male Old Scholarly": "TxGEqnHWrfWFTfGW9XjX", // Josh (American, Deep) - maybe a generic older voice?
  "Female Young Passionate": "AZnzlk1XvdvUeBnXmlld", // Dome (American, Young)
  "Male Intellectual": "ODq5zmih8GrVes37Dizd", // Patrick (American, Deep)
  "Male Witty American": "flq6f7yk4E4fJM5XTYuZ", // Michael (American, Deep)
  "Male Deep American": "VR6AewLTigWg4xSOukaG", // Arnold (American, Deep)
  "Male Intense Accent": "MF3mGyEYCl7XYWLGt9L6", // Adam (American, Deep)
  "Female Polish/French Accent": "EXAVITQu4vr4xnSDxMaL", // Bella (American, Soft)
  "Male German Accent": "bVMeCyTHy58xNoL34h3p", // Jeremy (American, Deep)
  "Male American Astronaut": "JBFqnCBsd6RMkjVDRZzb", // George (British, Raspy) - maybe swap?
};

// Fallback voice ID
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel

async function createAgent(character) {
  console.log(`Creating agent for: ${character.name}...`);

  const voiceId = VOICE_MAPPING[character.voice] || DEFAULT_VOICE_ID;

  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/convai/agents/create",
      {
        name: `TimePhone - ${character.name}`,
        conversation_config: {
          agent: {
            prompt: {
              prompt: character.prompt,
            },
            first_message: character.firstMessage,
            language: "en",
          },
          tts: {
            model_id: "eleven_turbo_v2", // Faster model for conversation
            voice_id: voiceId,
          },
        },
        platform_settings: {
          auth: {
            enable_auth: false, // Public agent so app can use without key in frontend
          },
        },
      },
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    const agentId = response.data.agent_id;
    console.log(`✅ Created ${character.name}: ${agentId}`);
    return {
      year: character.year,
      agentId: agentId,
    };
  } catch (error) {
    console.error(
      `❌ Failed to create ${character.name}:`,
      error.response?.data || error.message,
    );

    // Check if the error is 422 (Validation Error), maybe the voice ID is wrong
    if (error.response?.data?.detail?.status === "voice_not_found") {
      console.log("   Trying with default voice...");
      // Retry with default logic if needed, or just fail
    }

    // Try a simpler payload if the complex one fails (API changes frequently)
    return null;
  }
}

async function main() {
  console.log("Starting Agent Creation Script...");
  console.log("---------------------------------");

  const results = [];

  for (const char of CHARACTERS) {
    const result = await createAgent(char);
    if (result) {
      results.push(result);
    }
    // Small delay to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("---------------------------------");
  console.log("Creation Complete!");

  if (results.length > 0) {
    console.log("\nAdd the following lines to your .env file:\n");
    let envContent = "";
    results.forEach((res) => {
      const line = `VITE_AGENT_ID_${res.year}=${res.agentId}`;
      console.log(line);
      envContent += line + "\n";
    });

    // Optionally write to .env.local automatically?
    // Let's just create a file .env.agents for them to copy
    fs.writeFileSync(path.join(__dirname, "../.env.agents"), envContent);
    console.log(`\n(Saved to .env.agents)`);
  } else {
    console.log("No agents were created successfully.");
  }
}

main().catch(console.error);

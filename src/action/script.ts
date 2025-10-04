import OpenAI from "openai";

interface Script {
  imagePrompt: string;
  contentText: string;
}

interface ScriptResponse {
  content: Script[];
}

interface GenerateScriptResult {
  success: boolean;
  data?: Script[];
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Constants for configuration
const SCRIPT_CONFIG = {
  MAX_TOPIC_LENGTH: 200,
  MIN_TOPIC_LENGTH: 3,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  EXPECTED_SCENES: { min: 3, max: 8 }, // For 30-second video
} as const;

const openAi = new OpenAI({
  apiKey: process.env.OPENAI,
  timeout: 30000,
  maxRetries: 2,
});

export const generateScript = async (topic: string):Promise<GenerateScriptResult> => {

  const statTime  = 
};

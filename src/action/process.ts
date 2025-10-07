import { findPrompt } from "./findPrompt";
import { generateScript } from "./script";

export const process = async (videoId: string) => {
  try {
    const prompt = await findPrompt(videoId);

    const script = await generateScript(prompt || "");
  } catch (error) {
    console.error("Error processing video:", error);
    throw error;
  }
};

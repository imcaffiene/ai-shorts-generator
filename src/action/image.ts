import { prisma } from "@/lib/prisma";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const;

export const generateImage = async (videoId: string) => {
  try {
    const video = await prisma.video.findUnique({
      where: { videoId: videoId },
    });

    if (!video) return null;
  } catch (error) {
    console.error("Error in generateImage:", error);
    throw error;
  }
};

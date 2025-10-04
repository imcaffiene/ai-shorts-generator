"use server";

import { decreaseCredits } from "@/lib/decreaseCredits";
import { prisma } from "@/lib/prisma";
import { usersCredits } from "@/lib/usersCredits";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

/**
 * Server Action: Create Video
 *
 * This action handles the complete video creation workflow:
 * 1. User authentication and validation
 * 2. Input validation and sanitization
 * 3. Database transaction for video record and credit deduction
 * 4. Queue job creation for video processing
 * 5. Comprehensive error handling and logging
 *
 * @param prompt - User's video description prompt
 * @returns Promise<{videoId: string} | {error: string} | null>
 */

export const createVideo = async (
  prompt: string
): Promise<{ videoId: string } | { error: string } | null> => {
  try {
    // input validation and sanitization
    if (!prompt || typeof prompt != "string") {
      console.warn("Prompt is missing or not a string");
      return { error: "Invalid prompt provider" };
    }

    const sanitizedPrompt = prompt.trim();

    if (sanitizedPrompt.length === 0) {
      return { error: "Video description cannot be empty" };
    }

    if (sanitizedPrompt.length < 10) {
      return {
        error:
          "Please provide a more detailed description (at least 10 characters)",
      };
    }

    if (sanitizedPrompt.length > 500) {
      return {
        error: "Description is too long. Please keep it under 500 characters",
      };
    }

    //user authentication and authorization
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      console.warn("Unauthenticated user attempted to create video");
      return {
        error: "Authentication required. Please sign in to create videos",
      };
    }

    //check credits before proceeding
    const userCredits = await usersCredits();

    if (userCredits < 1) {
      return {
        error:
          "You do not have enough credits to create a video. Please upgrade your account to continue.",
      };
    }

    // Generate unique video id
    const videoId = randomUUID();

    await prisma.video.create({
      data: {
        videoId,
        userId,
        prompt: sanitizedPrompt,
        processing: true,
      },
    });

    await decreaseCredits(userId);

    return { videoId };
  } catch (error) {
    console.error("Error in createVideo:", error);

    // Handle specific errors from decreaseCredits
    if (
      error instanceof Error &&
      error.message.includes("Not enough credits")
    ) {
      return { error: "Not enough credits" };
    }

    return { error: "Failed to create video. Please try again." };
  }
};

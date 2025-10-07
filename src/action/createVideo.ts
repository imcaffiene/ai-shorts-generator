"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { process } from "./process";

/**
 * Server Action: Create Video
 *
 * @param prompt - User's video description prompt
 * @returns Promise<{videoId: string} | {error: string} | null>
 */

export const createVideo = async (
  prompt: string
): Promise<{ videoId: string } | { error: string } | null> => {
  try {
    // -- Input validation --
    if (!prompt || typeof prompt !== "string")
      return { error: "Invalid prompt" };

    const sanitizedPrompt = prompt.trim();

    if (sanitizedPrompt.length === 0)
      return { error: "Video description cannot be empty" };

    if (sanitizedPrompt.length < 10)
      return {
        error:
          "Please provide a more detailed description (at least 10 characters)",
      };

    if (sanitizedPrompt.length > 500)
      return {
        error: "Description is too long. Please keep it under 500 characters",
      };

    // -- User authentication --
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) return { error: "Authentication required" };

    // -- Transaction: Create video + decrement credits atomically --
    const videoId = randomUUID();

    try {
      await prisma.$transaction(async (tx) => {
        // Check credits and decrement atomically
        const foundUser = await tx.user.findUnique({
          where: { userId },
          select: { credits: true },
        });

        if (!foundUser) throw new Error("User not found");
        if (foundUser.credits < 1) throw new Error("Not enough credits");

        //Decrement credits
        await tx.user.update({
          where: { userId },
          data: { credits: { decrement: 1 } },
        });

        // Create video
        await tx.video.create({
          data: {
            videoId,
            userId,
            prompt: sanitizedPrompt,
            processing: true,
          },
        });
      });
      process(videoId);
      return { videoId };
    } catch (error) {
      // Handle not enough credits or user not found
      if (error instanceof Error && error.message === "Not enough credits") {
        return {
          error:
            "You do not have enough credits to create a video. Please upgrade your account to continue.",
        };
      }
      if (error instanceof Error && error.message === "User not found") {
        return { error: "User not found. Please sign in again." };
      }
      console.error("Error in transaction (createVideo):", {
        error,
        userId,
        videoId,
        timestamp: new Date().toISOString(),
      });
      return { error: "Failed to create video. Please try again." };
    }
  } catch (error) {
    console.error("Error in createVideo:", error);
    return { error: "Failed to create video. Please try again." };
  }
};

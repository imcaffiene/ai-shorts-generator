import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Retrieves the credit balance for the currently authenticated user
 * @returns Promise<number> - User's credit balance (0 if user not found or error)
 */

export const usersCredits = async (): Promise<number> => {
  try {
    const user = await currentUser();

    if (!user?.id) {
      console.warn("No authenticated user found");
      return 0;
    }

    const userId = user.id;

    try {
      const userData = await prisma.user.findUnique({
        where: {
          userId: userId,
        },
        select: {
          credits: true,
        },
      });

      if (!userData) {
        console.warn(`User with id ${userId} not found`);
        return 0;
      }

      return userData.credits;
    } catch (e) {
      console.error("Database query failed:", {
        userId,
        error: e,
        timestamp: new Date().toISOString(),
      });

      return 0;
    }
  } catch (authError) {
    console.error("Authentication error in userCredits:", {
      error: authError,
      timestamp: new Date().toISOString(),
    });

    // Return 0 for graceful degradation
    return 0;
  }
};

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

const checkUser = async (): Promise<string | null> => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const userId = user.id;
    const email = user.primaryEmailAddress?.emailAddress;

    //validate that we have required data from clerk

    if (!userId || !email) {
      console.error("User id is missing or email is missing");
      return null;
    }

    // check if user is already existing in out database
    const existingUser = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    //create new user if not existing
    if (!existingUser) {
      try {
        await prisma.user.create({
          data: {
            userId: userId,
            email: email,
          },
        });

        console.log(`New user is created:"${userId}`);
      } catch (error) {
        console.log("Failed to create user in database", error);
      }
    }
    return userId;
  } catch (e) {
    console.log("Error in check user function", e);
    return null;
  }
};

export default checkUser;

import { prisma } from "./prisma";

export const decreaseCredits = async (
  userId: string,
  amount: number = 1
): Promise<number> => {
  if (!userId) {
    throw new Error("User id is missing");
  }

  if (amount < 1) {
    throw new Error("Amount must be at least 1");
  }

  //check current credits
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { credits: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.credits < amount) {
    throw new Error("Not enough credits");
  }

  //decrease credits
  const updateUser = await prisma.user.update({
    where: { userId },
    data: {
      credits: {
        decrement: amount,
      },
    },
    select: { credits: true },
  });
  return updateUser.credits;
};

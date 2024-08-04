"use server";

import { calculateTotalPrice } from "@/lib/configuration";
import db from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type CreateCheckoutType = {
  configId: string;
};
export async function createCheckoutSession({ configId }: CreateCheckoutType) {
  const config = await db.configuration.findUnique({ where: { id: configId } });

  if (!config) {
    throw new Error("No such configuration found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const totalPrice = calculateTotalPrice(config);
}

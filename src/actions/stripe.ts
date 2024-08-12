"use server";

import { calculateTotalPrice } from "@/lib/configuration";
import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { PRICE_TYPE } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

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
  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: config.id,
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: totalPrice / 100,
        userId: user.id,
        configurationId: config.id,
      },
    });
  }

  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [config.imageUrl],
    default_price_data: {
      currency: PRICE_TYPE.USD,
      unit_amount: totalPrice,
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${config.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["DE", "EG", "US"] },
    metadata: {
      userId: user.id,
      order: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
}

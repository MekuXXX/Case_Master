"use server";

import { auth } from "@/lib/auth";
import { calculateTotalPrice } from "@/lib/configuration";
import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { PRICE_TYPE } from "@/lib/utils";
import { Order } from "@prisma/client";

type CreateCheckoutType = {
  configId: string;
};
export async function createCheckoutSession({ configId }: CreateCheckoutType) {
  const config = await db.configuration.findUnique({ where: { id: configId } });

  if (!config) {
    throw new Error("No such configuration found");
  }

  const session = await auth();

  if (!session) {
    throw new Error("You need to be logged in");
  }

  const { user } = session;

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const totalPrice = calculateTotalPrice(config);
  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id!,
      configurationId: config.id,
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        userId: user.id!,
        amount: totalPrice / 100,
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
    line_items: [{ price: product.default_price as string, quantity: 1 }],
    metadata: {
      userId: user.id!,
      orderId: order.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${config.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["DE", "EG", "US"] },
  });

  return { url: stripeSession.url };
}

type GetPaymentStatusParams = {
  orderId: string;
};
export async function getPaymentStatus(params: GetPaymentStatusParams) {
  const session = await auth();

  if (!session) {
    throw new Error("You need to be logged in to view this page");
  }

  const order = await db.order.findUnique({
    where: { id: params.orderId },
    include: {
      shippingAddress: true,
      billingAddress: true,
      configuration: true,
      user: true,
    },
  });

  if (!order) {
    throw new Error("This order is not exist");
  }

  if (!order.isPaid) {
    return { success: false };
  }

  return { success: true, order };
}

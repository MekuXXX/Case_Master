import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import OrderRecievedEmail from "@/components/emails/OrderRecievedEmail";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(res: Request) {
  try {
    const body = await res.text();
    const sig = headers().get("stripe-signature");
    if (!sig) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = await stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        if (!event.data.object.customer_details?.email) {
          throw new Error("Missing user email");
        }

        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, orderId } = session.metadata || {
          userId: null,
          orderId: null,
        };

        if (!userId || !orderId) {
          throw new Error("Invalid request metadata");
        }

        const billingAddress = session.customer_details?.address;
        const shippingAddress = session.shipping_details?.address;
        const updatedOrder = await db.order.update({
          where: {
            id: orderId,
          },
          data: {
            isPaid: true,
            shippingAddress: {
              create: {
                name: session.customer_details?.name!,
                city: shippingAddress?.city!,
                country: shippingAddress?.country!,
                postalCode: shippingAddress?.postal_code!,
                street: shippingAddress?.line1!,
                state: shippingAddress?.state,
              },
            },
            billingAddress: {
              create: {
                name: session.shipping_details?.name!,
                city: billingAddress?.city!,
                country: billingAddress?.country!,
                postalCode: billingAddress?.postal_code!,
                street: billingAddress?.line1!,
                state: billingAddress?.state,
              },
            },
          },
        });

        // await resend.emails.send({
        //   from: "CaseMaster <mekux@testing.com>",
        //   to: [event.data.object.customer_details.email],
        //   subject: "Thanks for your order!",
        //   react: OrderRecievedEmail({
        //     orderId,
        //     orderDate: updatedOrder.createdAt.toLocaleDateString(),

        //     // @ts-ignore
        //     shippingAddress: {
        //       name: session.customer_details!.name!,
        //       city: shippingAddress!.city!,
        //       country: shippingAddress!.country!,
        //       postalCode: shippingAddress!.postal_code!,
        //       street: shippingAddress!.line1!,
        //       state: shippingAddress!.state,
        //     },
        //   }),
        // });
      }
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

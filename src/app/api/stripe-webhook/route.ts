import OrderRecievedEmail from "@/components/emails/OrderRecievedEmail";
import db from "@/lib/db";
import { sendMail } from "@/lib/nodemailer";
import { stripe } from "@/lib/stripe";
import { render } from "@react-email/components";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

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
          include: {
            user: { select: { email: true, name: true } },
          },
        });
        const renderedEmail = render(
          OrderRecievedEmail({
            orderId,
            orderDate: updatedOrder.createdAt.toLocaleDateString(),
            // @ts-ignore
            shippingAddress: {
              name: session.customer_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              street: shippingAddress!.line1!,
              state: shippingAddress!.state,
            },
          }),
        );

        await sendMail({
          recipients: [
            {
              name: updatedOrder.user.name,
              address: updatedOrder.user.email,
            },
          ],

          subject: "Thanks for your order!",
          html: renderedEmail,
        });
      }
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

import { getPaymentStatus } from "@/actions/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const orderId = data.orderId;

    if (!orderId) {
      throw new Error("Must provide an order id to check the status");
    }

    const status = await getPaymentStatus({ orderId });
    let statusCode = 200;

    if (!status) statusCode = 400;
    return NextResponse.json(status, { status: statusCode });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

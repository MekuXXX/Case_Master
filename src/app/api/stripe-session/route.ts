import { createCheckoutSession } from "@/actions/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const configId = body.configId;

    if (!configId) {
      throw new Error("Missing the config id of the session");
    }
    const session = await createCheckoutSession({ configId });
    return NextResponse.json(session, {
      status: 200,
    });
  } catch (error) {}
}

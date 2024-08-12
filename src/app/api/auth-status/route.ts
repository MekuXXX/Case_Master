import { getAuthStatus } from "@/actions/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await getAuthStatus();
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

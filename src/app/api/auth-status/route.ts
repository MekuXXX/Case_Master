import { getAuthStatus } from "@/actions/user";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getAuthStatus();
  return NextResponse.json(res, { status: 200 });
}

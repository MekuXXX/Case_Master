"use server";
import { auth } from "@/lib/auth";

export async function getAuthStatus() {
  const session = await auth();

  if (!session) {
    throw new Error("Session is not exist");
  }

  return { success: true };
}

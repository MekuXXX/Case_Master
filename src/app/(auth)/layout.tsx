import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = { children: React.ReactNode };

export default async function AuthenticationLayout({ children }: Props) {
  const session = await auth();

  if (session && session.user) redirect("/");

  return children;
}

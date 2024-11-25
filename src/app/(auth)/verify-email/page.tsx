import { notFound, redirect } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import db from "@/lib/db";
import { TokenType, sendAuthToken } from "@/lib/token";

async function verifyEmail(token: string) {
  const dbToken = await db.activationToken.findUnique({ where: { id: token } });

  if (!dbToken) {
    return {
      success: false,
      message: "Token is not exist, please provide a valid token",
    };
  }

  if (dbToken.isUsed) {
    return {
      success: false,
      message: "Token was already used, please provide a valid token",
    };
  }

  if (new Date(Date.now()) > dbToken.expireAt) {
    await sendAuthToken(TokenType.VERIFY_EMAIL, dbToken.userId);

    return {
      success: false,
      message: "Token is expired, we will send a new email",
    };
  }

  const activatedToken = await db.activationToken.update({
    where: { id: token },
    data: { isUsed: true, user: { update: { isActive: true } } },
    include: { user: { select: { id: true } } },
  });

  db.activationToken.deleteMany({
    where: { userId: activatedToken.userId, isUsed: { not: true } },
  });

  return {
    success: true,
    message: "User is activated successfully",
  };
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = searchParams.token.trim();

  let verificationStatus: "success" | "error";
  let message = "";

  if (!token) {
    verificationStatus = "error";
    message = "No verification token provided.";
  } else {
    const result = await verifyEmail(token);
    verificationStatus = result.success ? "success" : "error";
    message = result.message;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="min-w-[25rem] max-w-[35rem]">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>We're confirming your email address</CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-24 w-24 text-green-500" />
              <p className="mt-4 text-sm text-muted-foreground">{message}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-24 w-24 text-red-500" />
              <p className="mt-4 text-sm text-muted-foreground">{message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "outline" })}
          >
            Go to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

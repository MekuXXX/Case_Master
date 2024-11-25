import ResetPasswordForm from "@/components/authentication/ResetPasswordForm";
import db from "@/lib/db";
import { TokenType, sendAuthToken } from "@/lib/token";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your account password",
};

type Props = {
  searchParams: {
    token: string;
  };
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = searchParams;

  if (!token) {
    return notFound();
  }

  const dbToken = await db.forgotPasswordToken.findUnique({
    where: { id: token },
  });

  if (!dbToken) {
    return notFound();
  }

  if (dbToken.isUsed) {
    return notFound();
  }

  const isExpired = new Date(Date.now()) > dbToken.expireAt;

  if (isExpired) {
    await sendAuthToken(TokenType.FORGET_PASSWORD, dbToken.userId);
  }

  return (
    <div className="container grid min-h-screen place-content-center">
      <div className="mx-auto flex w-[35rem] flex-col justify-center space-y-6">
        {isExpired ? (
          <p>Token is expired, We have sent another mail</p>
        ) : (
          <ResetPasswordForm token={token} />
        )}
      </div>
    </div>
  );
}

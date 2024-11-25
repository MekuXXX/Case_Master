import VerifyEmail from "@/components/emails/VerifyEmail";
import { sendMail } from "@/lib/nodemailer";
import { render } from "@react-email/components";
import ResetPasswordEmail from "@/components/emails/ResetPassword";
import db from "./db";

export enum TokenType {
  VERIFY_EMAIL,
  FORGET_PASSWORD,
}

export async function sendAuthToken(type: TokenType, userId: string) {
  const createToken = {
    data: {
      userId: userId,
      expireAt: new Date(Date.now() + 60 * 60 * 1000),
    },
    include: {
      user: true,
    },
  };

  if (type === TokenType.VERIFY_EMAIL) {
    const token = await db.activationToken.create(createToken);
    const renderedEmail = await render(
      VerifyEmail({
        userName: token.user.name,
        verificationLink: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token.id}`,
      }),
    );
    await sendMail({
      subject: "Verification email to Case Master",
      recipients: [{ name: token.user.name, address: token.user.email }],
      html: renderedEmail,
    });
  } else {
    const token = await db.forgotPasswordToken.create(createToken);
    const renderedEmail = await render(
      ResetPasswordEmail({
        userName: token.user.name,
        resetLink: `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token.id}`,
      }),
    );
    await sendMail({
      subject: "Reset password of Case Master",
      recipients: [{ name: token.user.name, address: token.user.email }],
      html: renderedEmail,
    });
  }
}

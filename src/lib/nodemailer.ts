import nodemailer from "nodemailer";
import Mail, { Address } from "nodemailer/lib/mailer";

export interface SendMailDto {
  from?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  port: Number(process.env.MAIL_PORT),
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  secure: true,
});

export async function sendMail(data: SendMailDto) {
  const { from, html, recipients, text, subject } = data;

  const options: Mail.Options = {
    from: from
      ? from
      : {
          name: process.env.APP_NAME!,
          address: process.env.APP_MAIL!,
        },
    to: recipients,
    subject,
    html,
    text,
  };

  try {
    const result = await transporter.sendMail(options);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

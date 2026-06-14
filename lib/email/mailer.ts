import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMail({ to, subject, html, text }: MailOptions) {
  await mailer.sendMail({
    from: `"Worth Fighting For" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

import { Resend } from "resend";
import ResetTemplate from "@/components/email-template/reset-password";

const { EMAIL_CLIENT_API_KEY, SENDER_EMAIL } = process.env;

if (!EMAIL_CLIENT_API_KEY)
  throw new Error(".env: Missing email client api key.");
if (!SENDER_EMAIL) throw new Error(".env: Missing sender email.");

const resend = new Resend(EMAIL_CLIENT_API_KEY);

export const mailResetPasswordToken = async (
  name: string,
  email: string,
  token: string,
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: "Confirm your email",
      react: await ResetTemplate({ name, email, token }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};

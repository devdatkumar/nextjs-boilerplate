import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  token: string;
}

export const VerifyEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  token,
}) => {
  const appUrl = process.env.APP_URL;
  const verificationLink = `${appUrl}/auth/verify-email?email=${encodeURIComponent(
    email,
  )}&token=${encodeURIComponent(token)}`;

  return (
    <div className="font-sans text-gray-800">
      <h1 className="text-2xl font-bold text-gray-900">Hello, {name}!</h1>
      <p className="text-base">
        Thank you for signing up! To complete your registration, please verify
        your email address by clicking the link below:
      </p>
      <p className="my-4">
        <a
          href={verificationLink}
          className="inline-block px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Verify email
        </a>
      </p>
      <p className="text-sm">Or, copy and paste this URL into your browser:</p>
      <p className="text-blue-600 text-sm break-words">{verificationLink}</p>
      <p className="text-xs text-gray-500">
        If you did not create an account, please ignore this email.
      </p>
    </div>
  );
};

export default VerifyEmailTemplate;

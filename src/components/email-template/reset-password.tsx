import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  token: string;
}

export const ResetPasswordTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  token,
}) => {
  const appUrl = process.env.APP_URL;
  const resetPasswordLink = `${appUrl}/auth/reset-password?email=${encodeURIComponent(
    email,
  )}&token=${encodeURIComponent(token)}`;

  return (
    <div className="font-sans text-gray-800">
      <h1 className="text-2xl font-bold text-gray-900">Hello, {name}!</h1>
      <p className="text-base">
        To reset your account password, please verify your email address by
        clicking the link below:
      </p>
      <p className="my-4">
        <a
          href={resetPasswordLink}
          className="inline-block px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Reset password
        </a>
      </p>
      <p className="text-sm">Or, copy and paste this URL into your browser:</p>
      <p className="text-blue-600 text-sm break-words">{resetPasswordLink}</p>
      <p className="text-xs text-gray-500">
        If you did not request password reset, please ignore this email or
        contact support if you have concerns.
      </p>
    </div>
  );
};

export default ResetPasswordTemplate;

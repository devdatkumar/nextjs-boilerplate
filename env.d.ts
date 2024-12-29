declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_URL: string;
      AUTH_SECRET: string;
      DATABASE_URL: string;
      AUTH_GITHUB_ID: string;
      AUTH_GITHUB_SECRET: string;
      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRET: string;
      AUTH_APPLE_ID: string;
      AUTH_APPLE_SECRET: string;
      SENDER_EMAIL: string;
      EMAIL_CLIENT_API_KEY: string;
    }
  }
}

export {};

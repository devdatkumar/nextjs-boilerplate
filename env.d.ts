declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SECRET: string;
      DATABASE_URL: string;
      AUTH_GITHUB_ID: string;
      AUTH_GITHUB_SECRET: string;
      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRET: string;
      AUTH_APPLE_ID: string;
      AUTH_APPLE_SECRET: string;
    }
  }
}

export {};

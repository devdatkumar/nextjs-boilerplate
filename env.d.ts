declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SECRET: string;
      GITHUB_ID: string;
      GITHUB_SECRET: string;
      DATABASE_URL: string;
    }
  }
}

export {};

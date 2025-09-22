declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "test" | "production";
    PORT?: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    KAKAO_CLIENT_ID?: string;
    KAKAO_CLIENT_SECRET?: string;
  }
}

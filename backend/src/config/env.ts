import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  openaiApiKey: requireEnv("OPENAI_API_KEY"),
};
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["JWT_SECRET"];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/focus-ai",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d"
};

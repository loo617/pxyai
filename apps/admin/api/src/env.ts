import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.string().default("dev"),
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN:
      process.env.NODE_ENV === "dev"
        ? z.string().optional()
        : z.string().min(1),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
  },
  runtimeEnv: process.env,
  skipValidation: true,
});

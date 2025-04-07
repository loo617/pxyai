import type { Config } from "drizzle-kit";

import { env } from "./env";

export default {
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  strict: true,
  dialect: "postgresql",
} satisfies Config;

console.log("env.DATABASE_URL =", env.DATABASE_URL);

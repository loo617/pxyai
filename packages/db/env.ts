import { createEnv } from "@t3-oss/env-core";
import * as dotenv from "dotenv";
import { z } from "zod";

// 根据 NODE_ENV 读取对应的 .env 文件
const nodeEnv = process.env.NODE_ENV || "dev";
dotenv.config({ path: `.env.${nodeEnv}` }); // 加载 .env.production、.env.dev 等

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  skipValidation: false,
});

console.log(env.DATABASE_URL);

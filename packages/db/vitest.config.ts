// vitest.config.ts
import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config(); // 👈 显式加载 .env 文件

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
});

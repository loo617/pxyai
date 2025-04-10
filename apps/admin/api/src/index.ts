import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "@/env";
import { apiRoute } from "@/routes/v1";
import { publicRoute } from "@/routes/public";
import { clearExpiredCaptchas } from "@/tasks/clearCaptcha";

const app = new Hono();

// app.use();

app.route("/", publicRoute);

app.route("/v1", apiRoute);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`🚀 Server running at http://localhost:${env.PORT}`);

// 定时任务：每小时清理一次验证码
const taskInterval = setInterval(clearExpiredCaptchas, 60 * 60 * 1000);

// ✅ 捕获退出信号，优雅清理定时任务
process.on("SIGINT", () => {
  clearInterval(taskInterval);
  console.log("👋 Gracefully shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  clearInterval(taskInterval);
  console.log("👋 Gracefully shutting down...");
  process.exit(0);
});

export default app;

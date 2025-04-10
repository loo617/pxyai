import { verifyJwt } from "@/utils/jwt";
import { createMiddleware } from "hono/factory";

export const jwtAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyJwt(token);

  if (!decoded) {
    return c.json({ error: "Invalid token" }, 401);
  }

  // 存储在 context 中
  c.set("user", decoded);

  await next();
});

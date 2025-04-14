import { createMiddleware } from "hono/factory";
import { verifyJwt } from "../utils/jwt";

export const jwtAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Token is required");
  }

  const decoded = verifyJwt(token);

  if (!decoded) {
    return c.json({ error: "Invalid token" }, 401);
  }

  // 存储在 context 中
  c.set("user", decoded);

  await next();
});

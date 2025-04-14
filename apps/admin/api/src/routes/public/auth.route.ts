import { zValidator } from "@hono/zod-validator";
import { db, eq } from "@pxyai/db";
import { adminUser, captchas } from "@pxyai/db/src/schema";
import bcrypt from "bcryptjs";
import { Hono } from "hono";
import * as svgCaptcha from "svg-captcha";
import { z } from "zod";
import { signJwt } from "../../utils/jwt";

export const authRoute = new Hono()
  //获取验证码
  .get("/captcha", async (c) => {
    // 创建验证码
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      ignoreChars: "0o1i", // 忽略容易混淆的字符
      noise: 2, // 干扰线条数
      color: true, // 彩色验证码
      background: "#f0f0f0", // 背景色
    });

    // 生成唯一ID用于客户端标识
    const captchaId = Math.random().toString(36).substring(2, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟后过期

    // 存储验证码文本，设置5分钟过期
    await db.insert(captchas).values({
      captchasId: captchaId,
      captchasText: captcha.text,
      expiresAt: expiresAt,
    });

    // 返回SVG图片和验证码ID
    return c.json({
      id: captchaId,
      svg: captcha.data,
      expiresIn: 300, // 过期时间(秒)
    });
  })
  //登录
  .post(
    "/login",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
        captchaToken: z.string(),
        captchaCode: z.string(),
      })
    ),
    async (c) => {
      const { email, password, captchaToken, captchaCode } =
        c.req.valid("json");

      // 校验验证码
      const captchaCheck = await validateCaptcha(captchaToken, captchaCode);
      if (!captchaCheck.valid) {
        return c.json({ success: false, message: captchaCheck.message }, 400);
      }

      const users = await db
        .select()
        .from(adminUser)
        .where(eq(adminUser.email, email))
        .limit(1);

      if (users.length === 0) {
        return c.json({ error: "没找到用户" }, 404);
      }

      const user = users[0];

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (user.isActive !== 1) {
        return c.json({ error: "用户未生效" }, 403);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return c.json({ error: "密码错误" }, 401);
      }

      // ✅ 生成 JWT
      const token = signJwt({
        userId: user.id,
      });

      return c.json({
        success: true,
        message: "登录成功",
        token,
      });
    }
  )
  //无验证码登录
  .post(
    "/loginnocode",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    ),
    async (c) => {
      const { email, password } = c.req.valid("json");

      const users = await db
        .select()
        .from(adminUser)
        .where(eq(adminUser.email, email))
        .limit(1);

      if (users.length === 0) {
        return c.json({ error: "没找到用户" }, 404);
      }

      const user = users[0];

      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (user.isActive !== 1) {
        return c.json({ error: "用户未生效" }, 403);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return c.json({ error: "密码错误" }, 401);
      }

      // ✅ 生成 JWT
      const token = signJwt({
        userId: user.id,
      });

      return c.json({
        success: true,
        message: "登录成功",
        token,
      });
    }
  )
  //注销
  .post("/logout", async (c) => {
    // 实际生产中你应该清除 session/token
    return c.json({ message: "Logout successful" });
  });

async function validateCaptcha(
  token: string,
  code: string
): Promise<{ valid: boolean; message?: string }> {
  const [captchaData] = await db
    .select()
    .from(captchas)
    .where(eq(captchas.captchasId, token)) // ✅ 字段名改为 captchaId
    .limit(1);

  if (!captchaData) {
    return { valid: false, message: "验证码已过期或无效" };
  }

  if (!captchaData.expiresAt || Date.now() > captchaData.expiresAt.getTime()) {
    return { valid: false, message: "验证码已过期" };
  }

  if (code.toLowerCase() !== captchaData.captchasText.toLowerCase()) {
    return { valid: false, message: "验证码错误" };
  }

  return { valid: true };
}

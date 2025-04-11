import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, eq } from "@pxyai/db";
import { apiKey } from "@pxyai/db/src/schema";
import { stat } from "fs";

export const apikeyRoute = new Hono()
  //查询 apikey 列表
  .get("/", async (c) => {
    const page = Number(c.req.query("page") || "1");
    const limit = Number(c.req.query("limit") || "10");
    const offset = (page - 1) * limit;

    const keys = await db.select().from(apiKey).limit(limit).offset(offset);
    const count = await db.$count(apiKey);

    return c.json({
      data: keys,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  })
  //添加 apikey
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        openUserId: z.string(),
        key: z.string(),
        status: z.number().optional(),
        expiresAt: z.string().optional(),
      })
    ),
    async (c) => {
      const body = c.req.valid("json");
      const [created] = await db.insert(apiKey).values(body).returning();
      return c.json(created);
    }
  )
  // 更新 apikey
  .put(
    "/:id",
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        status: z.number().optional(),
        expiresAt: z.string().optional(),
      })
    ),
    async (c) => {
      const id = Number(c.req.param("id"));
      const body = c.req.valid("json");
      const [updated] = await db
        .update(apiKey)
        .set(body)
        .where(eq(apiKey.id, id))
        .returning();
      return c.json(updated);
    }
  )
  //删除 apikey
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await db.delete(apiKey).where(eq(apiKey.id, id));
    return c.json({ message: "API key deleted successfully" });
  });

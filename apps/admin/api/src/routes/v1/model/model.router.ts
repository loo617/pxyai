import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, eq } from "@pxyai/db";
import { model } from "@pxyai/db/src/schema";

export const modelRoute = new Hono()
  //查询模型列表
  .get("/", async (c) => {
    const page = Number(c.req.query("page") || "1");
    const limit = Number(c.req.query("limit") || "10");
    const offset = (page - 1) * limit;

    const data = await db.select().from(model).limit(limit).offset(offset);
    const count = await db.$count(model);

    return c.json({
      data: data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  })
  //添加模型
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        providerCode: z.string(),
        model: z.string(),
        type: z.number(),
        version: z.string(),
        context: z.number(),
        priceInput: z.string(),
        priceOutput: z.string(),
        status: z.number(),
        rateLimit: z.number(),
      })
    ),
    async (c) => {
      const body = c.req.valid("json");
      const [created] = await db.insert(model).values(body).returning();
      return c.json(created);
    }
  )
  //更新模型
  .put("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const [updated] = await db
      .update(model)
      .set(body)
      .where(model.id.eq(id))
      .returning();
    return c.json(updated);
  })
  //删除模型
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await db.delete(model).where(model.id.eq(id));
    return c.text("Deleted");
  });

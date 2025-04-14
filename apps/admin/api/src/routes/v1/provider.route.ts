import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db, eq, modelInsertScheme, modelUpdateSchema } from "@pxyai/db";
import { provider } from "@pxyai/db/src/schema";
import { IdParamsSchema, PageQuerySchema } from "../../utils/commonSchema";

export const providerRoute = new Hono()
  //根据id查询服务商
  .get("/:id", zValidator("param", IdParamsSchema), async (c) => {
    const id = Number(c.req.param("id"));
    const data = await db.select().from(provider).where(eq(provider.id, id));
    return c.json(data);
  })
  //查询服务商列表
  .get("/", zValidator("query", PageQuerySchema), async (c) => {
    const { page, limit } = c.req.valid("query");
    const offset = (page - 1) * limit;
    const data = await db.select().from(provider).limit(limit).offset(offset);
    const count = await db.$count(provider);
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
  //添加服务商
  .post("/", zValidator("json", modelInsertScheme), async (c) => {
    const body = c.req.valid("json");
    const [created] = await db.insert(provider).values(body).returning();
    return c.json(created);
  })
  //更新服务商
  .put("/", zValidator("json", modelUpdateSchema), async (c) => {
    const body = await c.req.json();
    if (!body.id) {
      return c.json({ error: "id is required" }, 400);
    }
    const [updated] = await db
      .update(provider)
      .set(body)
      .where(eq(provider.id, body.id))
      .returning();
    return c.json(updated);
  })
  //删除服务商
  .delete("/:id", zValidator("param", IdParamsSchema), async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    await db
      .delete(provider)
      .where(eq(provider.id, id))
      .returning({ id: provider.id });
    return c.json({ message: "provider deleted successfully" });
  });

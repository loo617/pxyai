import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db, eq } from "@pxyai/db";
import { model } from "@pxyai/db/src/schema";
import { modelUpdateSchema, modelInsertScheme } from "@pxyai/db/src/zod";
import { IdParamsSchema, PageQuerySchema } from "../../utils/commonSchema";

export const modelRoute = new Hono()
  //查询模型列表
  .get("/", zValidator("query", PageQuerySchema), async (c) => {
    const { page, limit } = c.req.valid("query");
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
  .post("/", zValidator("json", modelInsertScheme), async (c) => {
    const body = c.req.valid("json");
    const [created] = await db.insert(model).values(body).returning();
    return c.json(created);
  })
  //更新模型
  .put("/", zValidator("json", modelUpdateSchema), async (c) => {
    const body = await c.req.json();
    if (!body.id) {
      return c.json({ error: "id is required" }, 400);
    }
    const [updated] = await db
      .update(model)
      .set(body)
      .where(eq(model.id, body.id))
      .returning();
    return c.json(updated);
  })
  //删除模型
  .delete("/:id", zValidator("param", IdParamsSchema), async (c) => {
    const id = Number(c.req.param("id"));
    await db.delete(model).where(eq(model.id, id));
    return c.json({ message: "model deleted successfully" });
  });

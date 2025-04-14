import { Hono } from "hono";
import { zValidator } from "../../utils/validator-wrapper";
import { apiKeyInsertScheme, apiKeyUpdateSchema, db, eq } from "@pxyai/db";
import { apiKey } from "@pxyai/db/src/schema";
import { IdParamsSchema, PageQuerySchema } from "../../utils/commonSchema";

export const apiKeyRoute = new Hono()
  //查询 apikey 列表
  .get("/", zValidator("query", PageQuerySchema), async (c) => {
    const { page, limit } = c.req.valid("query");
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
  .post("/", zValidator("json", apiKeyInsertScheme), async (c) => {
    const body = c.req.valid("json");
    const [created] = await db.insert(apiKey).values(body).returning();
    return c.json(created);
  })
  // 更新 apikey
  .put("/", zValidator("json", apiKeyUpdateSchema), async (c) => {
    const body = c.req.valid("json");
    if (!body.id) {
      return c.json({ error: "id is required" }, 400);
    }
    const [updated] = await db
      .update(apiKey)
      .set(body)
      .where(eq(apiKey.id, body.id))
      .returning();
    return c.json(updated);
  })
  //删除 apikey
  .delete("/:id", zValidator("param", IdParamsSchema), async (c) => {
    const id = Number(c.req.param("id"));
    await db.delete(apiKey).where(eq(apiKey.id, id));
    return c.json({ message: "API key deleted successfully" });
  });

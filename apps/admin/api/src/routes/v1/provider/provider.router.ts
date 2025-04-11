import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, eq } from "@pxyai/db";
import { provider } from "@pxyai/db/src/schema";

export const providerRoute = new Hono()
  .get("/", async (c) => {
    const data = await db.select().from(provider);
    return c.json(data);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        providerCode: z.string(),
        providerName: z.string(),
        apiUrl: z.string(),
        apiKey: z.string(),
        status: z.number().optional(),
      })
    ),
    async (c) => {
      const body = c.req.valid("json");
      const [created] = await db.insert(provider).values(body).returning();
      return c.json(created);
    }
  )
  .put("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const [updated] = await db
      .update(provider)
      .set(body)
      .where(eq(provider.id, id))
      .returning();
    return c.json(updated);
  })
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await db.delete(provider).where(eq(provider.id, id));
    return c.text("Deleted");
  });

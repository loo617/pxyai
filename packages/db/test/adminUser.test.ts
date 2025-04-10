// test/adminUser.test.ts
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { adminUser } from "../src/schema/adminUser";
import { sql } from "drizzle-orm";
import { env } from "../env";

let db: ReturnType<typeof drizzle>;

beforeAll(async () => {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  db = drizzle(pool);
  // 清理表，准备测试
  await db.execute(sql`DELETE FROM admin_user`);
});

afterAll(async () => {
  await db.execute(sql`DELETE FROM admin_user`);
});

describe("adminUser schema", () => {
  it("should insert a new admin user", async () => {
    const result = await db
      .insert(adminUser)
      .values({
        userName: "testuser",
        email: "test@example.com",
        password: "securepassword",
      })
      .returning();
    expect(result[0]).toHaveProperty("admin_id");
    expect(result[0].isSuperadmin).toBe(false);
    expect(result[0].mustResetPassword).toBe(true);
    expect(result[0].lastLoginIp).toBe("0.0.0.0");
  });

  it("should enforce unique email", async () => {
    await expect(() =>
      db.insert(adminUser).values({
        userName: "anotheruser",
        email: "test@example.com", // 重复
        password: "anotherpassword",
      })
    ).rejects.toThrow(/duplicate key/);
  });

  it("should enforce unique userName", async () => {
    await expect(() =>
      db.insert(adminUser).values({
        userName: "testuser", // 重复
        email: "new@example.com",
        password: "anotherpassword",
      })
    ).rejects.toThrow(/duplicate key/);
  });

  it("should allow nullable lockedUntil", async () => {
    const result = await db
      .insert(adminUser)
      .values({
        userName: "locktest",
        email: "lock@example.com",
        password: "password123",
        lockedUntil: null,
      })
      .returning();

    expect(result[0].lockedUntil).toBeNull();
  });
});

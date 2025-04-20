import { db, eq } from "@pxyai/db";
import { adminUser } from "@pxyai/db/src/schema/adminUser";
import {
  adminUserInsertScheme,
  adminUserUpdateSchema,
} from "@pxyai/db/src/zod";
import bcrypt from "bcryptjs";
import { Hono } from "hono";
import { z } from "zod";
import type { Variables } from "../../types";
import { IdParamsSchema, PageQuerySchema } from "../../utils/commonSchema";
import { zValidator } from "../../utils/validator-wrapper";

export const adminUserRoute = new Hono<{ Variables: Variables }>()
  //获取当前用户信息
  .get("/me", async (c) => {
    const adminId = c.get("adminId");
    if (!adminId) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const admin = await db
      .select()
      .from(adminUser)
      .where(eq(adminUser.adminId, adminId))
      .limit(1);
    return c.json(admin[0]);
  })
  //添加用户
  .post("/", zValidator("json", adminUserInsertScheme), async (c) => {
    try {
      const data = c.req.valid("json");

      // 加密
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const newUser = await db
        .insert(adminUser)
        .values({
          ...data,
          password: hashedPassword,
        })
        .returning();
      return c.json(sanitizeUser(newUser[0]), 201);
    } catch (error: any) {
      // Check for unique constraint violations
      if (error.message?.includes("unique constraint")) {
        if (error.message.includes("admin_user_user_name_key")) {
          return c.json({ error: "Username already exists" }, 409);
        } else if (error.message.includes("admin_user_email_key")) {
          return c.json({ error: "Email already exists" }, 409);
        }
      }

      console.error("Error creating user:", error);
      return c.json({ error: "Failed to create user" }, 500);
    }
  })
  //用户列表
  .get("/", zValidator("query", PageQuerySchema), async (c) => {
    try {
      const { page, limit } = c.req.valid("query");
      const offset = (page - 1) * limit;

      const users = await db
        .select({
          id: adminUser.id,
          userName: adminUser.userName,
          email: adminUser.email,
          isSuperadmin: adminUser.isSuperadmin,
          isActive: adminUser.isActive,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt,
        })
        .from(adminUser)
        .limit(limit)
        .offset(offset);

      const count = await db.$count(adminUser);

      return c.json({
        data: users,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return c.json({ error: "Failed to fetch users" }, 500);
    }
  })
  //根据id获取用户
  .get("/:id", zValidator("param", IdParamsSchema), async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (isNaN(id)) {
        return c.json({ error: "Invalid ID format" }, 400);
      }

      const user = await db
        .select({
          id: adminUser.id,
          userName: adminUser.userName,
          email: adminUser.email,
          isSuperadmin: adminUser.isSuperadmin,
          isActive: adminUser.isActive,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt,
        })
        .from(adminUser)
        .where(eq(adminUser.id, id))
        .limit(1);

      if (user.length === 0) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(user[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      return c.json({ error: "Failed to fetch user" }, 500);
    }
  })
  //更新用户
  .put("/:id", zValidator("json", adminUserUpdateSchema), async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const data = c.req.valid("json");

      if (isNaN(id)) {
        return c.json({ error: "Invalid ID format" }, 400);
      }
      // If password is being updated, hash it
      let updateData = { ...data };
      if (data.password) {
        // 加密
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(data.password, salt);
      }

      updateData.updatedAt = new Date();

      const updated = await db
        .update(adminUser)
        .set(updateData)
        .where(eq(adminUser.id, id))
        .returning({
          id: adminUser.id,
          userName: adminUser.userName,
          email: adminUser.email,
          isSuperadmin: adminUser.isSuperadmin,
          isActive: adminUser.isActive,
          updatedAt: adminUser.updatedAt,
        });

      if (updated.length === 0) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(updated[0]);
    } catch (error: any) {
      // Check for unique constraint violations
      if (error.message?.includes("unique constraint")) {
        if (error.message.includes("admin_user_user_name_key")) {
          return c.json({ error: "Username already exists" }, 409);
        } else if (error.message.includes("admin_user_email_key")) {
          return c.json({ error: "Email already exists" }, 409);
        }
      }

      console.error("Error updating user:", error);
      return c.json({ error: "Failed to update user" }, 500);
    }
  })
  //删除用户
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number().int().positive(), // 自动把 string 转 number
      })
    ),
    async (c) => {
      try {
        const id = Number(c.req.param("id"));

        if (isNaN(id)) {
          return c.json({ error: "Invalid ID format" }, 400);
        }

        const deleted = await db
          .delete(adminUser)
          .where(eq(adminUser.id, id))
          .returning({ id: adminUser.id });

        if (deleted.length === 0) {
          return c.json({ error: "User not found" }, 404);
        }

        return c.json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        return c.json({ error: "Failed to delete user" }, 500);
      }
    }
  );

const sanitizeUser = (user: any) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

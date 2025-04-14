import { z } from "zod";

export const IdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const PageQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1), // 默认第 1 页
  limit: z.coerce.number().min(1).max(100).default(10), // 限制最大值
});

export const IdUUIDParamsSchema = z.object({
  id: z.string().uuid(),
});

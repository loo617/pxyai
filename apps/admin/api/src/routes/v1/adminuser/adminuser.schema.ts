import { z } from "zod";

// Schema for creating a new user
const createUserSchema = z.object({
  userName: z.string().min(3).max(64),
  email: z.string().email(),
  password: z.string().min(6),
  isSuperadmin: z.number().optional().default(0),
  mustResetPassword: z.number().optional().default(0),
  isActive: z.number().int().min(0).max(1).optional().default(1),
});

// Schema for updating a user
const updateUserSchema = z.object({
  userName: z.string().min(3).max(64).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  isSuperadmin: z.number().optional(),
  mustResetPassword: z.number().optional(),
  isActive: z.number().int().min(0).max(1).optional(),
  updatedAt: z.string(),
});

// Response schemas for better typing
const adminUserResponseSchema = z.object({
  id: z.number(),
  userName: z.string(),
  email: z.string(),
  isSuperadmin: z.number(),
  isActive: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Omitting sensitive fields like password
});

const adminUserListResponseSchema = z.array(adminUserResponseSchema);

// Helper function to sanitize user data (remove sensitive fields)
const sanitizeUser = (user: any) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

export {
  createUserSchema,
  updateUserSchema,
  adminUserResponseSchema,
  adminUserListResponseSchema,
  sanitizeUser,
};

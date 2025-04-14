import { adminUser } from "../schema/adminUser";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const adminUserInsertScheme = createInsertSchema(adminUser);

export const adminUserSelectSchema = createSelectSchema(adminUser);

export const adminUserUpdateSchema = createUpdateSchema(adminUser);

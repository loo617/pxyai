import { model } from "../schema/model";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const modelInsertScheme = createInsertSchema(model);

export const modelSelectSchema = createSelectSchema(model);

export const modelUpdateSchema = createUpdateSchema(model);

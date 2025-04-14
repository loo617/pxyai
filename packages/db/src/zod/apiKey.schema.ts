import { apiKey } from "../schema/apiKey";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const apiKeyInsertScheme = createInsertSchema(apiKey);

export const apiKeySelectSchema = createSelectSchema(apiKey);

export const apiKeyUpdateSchema = createUpdateSchema(apiKey);

import { provider } from "../schema/provider";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const providerInsertScheme = createInsertSchema(provider);

export const providerSelectSchema = createSelectSchema(provider);

export const providerUpdateSchema = createUpdateSchema(provider);

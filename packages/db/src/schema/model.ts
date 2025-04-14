import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const model = pgTable("model", {
  id: serial().primaryKey().notNull(),
  providerCode: varchar("provider_code", { length: 50 }).default("").notNull(),
  model: varchar({ length: 50 }).default("").notNull(),
  type: integer().default(0).notNull(),
  version: varchar({ length: 32 }).default("").notNull(),
  context: integer().default(0).notNull(),
  priceInput: numeric("price_input", { precision: 10, scale: 2 }).default(
    "0.00"
  ),
  priceOutput: numeric("price_output", { precision: 10, scale: 2 }).default(
    "0.00"
  ),
  status: integer().default(0).notNull(),
  rateLimit: integer("rate_limit").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

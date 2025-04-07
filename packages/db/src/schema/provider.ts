import {
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const provider = pgTable(
  "provider",
  {
    id: serial().primaryKey().notNull(),
    providerCode: varchar("provider_code", { length: 50 })
      .default("")
      .notNull(),
    providerName: varchar("provider_name", { length: 255 })
      .default("")
      .notNull(),
    status: integer().default(0).notNull(),
    apiUrl: varchar("api_url", { length: 255 }).default("").notNull(),
    apiKey: varchar("api_key", { length: 255 }).default("").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("provider_provider_code_key").on(table.providerCode)]
);

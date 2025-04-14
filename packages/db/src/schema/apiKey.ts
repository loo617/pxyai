import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const apiKey = pgTable(
  "api_key",
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).default("").notNull(),
    openUserId: varchar("open_user_id", { length: 32 }).default("").notNull(),
    key: varchar({ length: 255 }).notNull(),
    status: integer().default(0).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_api_key_key").using("btree", table.key.asc().nullsLast()),
    index("idx_api_key_open_user_id").using(
      "btree",
      table.openUserId.asc().nullsLast()
    ),
  ]
);

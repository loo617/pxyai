import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const openUser = pgTable(
  "open_user",
  {
    id: serial().primaryKey().notNull(),
    openUserId: varchar("open_user_id", { length: 32 }).default("").notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    isActive: integer("is_active").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_open_user_id").using(
      "btree",
      table.openUserId.asc().nullsLast()
    ),
    unique("open_user_email_key").on(table.email),
  ]
);

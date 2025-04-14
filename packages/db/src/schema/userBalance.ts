import {
  bigint,
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userBalances = pgTable(
  "user_balances",
  {
    id: serial().primaryKey().notNull(),
    openUserId: varchar("open_user_id", { length: 32 }).default("").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    balance: bigint({ mode: "number" }).default(0).notNull(),
    currency: varchar({ length: 10 }).default("USD").notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_user_balances_open_user_id").using(
      "btree",
      table.openUserId.asc().nullsLast()
    ),
  ]
);

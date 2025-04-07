import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const rechargeRecords = pgTable(
  "recharge_records",
  {
    id: serial().primaryKey().notNull(),
    openUserId: varchar("open_user_id", { length: 32 }).default("").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    amount: bigint({ mode: "number" }).notNull(),
    currency: varchar({ length: 10 }).default("USD").notNull(),
    method: varchar({ length: 50 }),
    status: integer().notNull(),
    referenceId: varchar("reference_id", { length: 255 }),
    metadata: jsonb(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    balanceBefore: bigint("balance_before", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    balanceAfter: bigint("balance_after", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_recharge_records_open_user_id").using(
      "btree",
      table.openUserId.asc().nullsLast().op("text_ops")
    ),
  ]
);

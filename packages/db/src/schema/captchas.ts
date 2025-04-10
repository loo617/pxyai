import { table } from "console";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const captchas = pgTable(
  "captchas",
  {
    id: serial().primaryKey().notNull(),
    captchasId: varchar("captchas_id", { length: 32 }).notNull(),
    captchasText: varchar("captchas_text", { length: 16 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_captchas_id").using("btree", table.captchasId.asc().nullsLast()),
  ]
);

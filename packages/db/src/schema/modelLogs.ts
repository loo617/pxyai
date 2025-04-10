import {
  bigint,
  index,
  inet,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const modelLogs = pgTable(
  "model_logs",
  {
    id: serial().primaryKey().notNull(),
    openUserId: varchar("open_user_id", { length: 32 }).default("").notNull(),
    providerCode: varchar("provider_code", { length: 50 })
      .default("")
      .notNull(),
    model: varchar({ length: 50 }).default("").notNull(),
    inputTokens: integer("input_tokens").default(0).notNull(),
    outputTokens: integer("output_tokens").default(0).notNull(),
    totalTokens: integer("total_tokens").default(0).notNull(),
    latencyMs: integer("latency_ms").default(0).notNull(),
    status: integer().default(0),
    errorMessage: text("error_message").default("").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    cost: bigint({ mode: "number" }).default(0).notNull(),
    apiKey: varchar("api_key", { length: 255 }).default("").notNull(),
    ipAddress: inet("ip_address").default("0.0.0.0").notNull(),
    requestStartTime: timestamp("request_start_time", {
      withTimezone: true,
      mode: "string",
    }),
    responseCompleteTime: timestamp("response_complete_time", {
      withTimezone: true,
      mode: "string",
    }),
    tokensPerSecond: numeric("tokens_per_second", { precision: 10, scale: 2 }),
  },
  (table) => [
    index("idx_model_logs_model").using("btree", table.model.asc().nullsLast()),
    index("idx_model_logs_open_user_id").using(
      "btree",
      table.openUserId.asc().nullsLast()
    ),
    index("idx_model_logs_provider_code").using(
      "btree",
      table.providerCode.asc().nullsLast()
    ),
  ]
);

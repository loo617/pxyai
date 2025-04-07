import {
  bigint,
  boolean,
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

export const adminUser = pgTable(
  "admin_user",
  {
    id: serial().primaryKey().notNull(),
    userName: varchar("user_name", { length: 64 }).notNull(),
    isSuperadmin: boolean("is_superadmin").default(false),
    mustResetPassword: boolean("must_reset_password").default(true),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    lastLoginIp: inet("last_login_ip").default("0.0.0.0").notNull(),
    isActive: integer("is_active").default(1).notNull(),
    loginRetries: integer("login_retries").default(0),
    lockedUntil: timestamp("locked_until", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("admin_user_user_name_key").on(table.userName),
    unique("admin_user_email_key").on(table.email),
  ]
);

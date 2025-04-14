import {
  index,
  inet,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const adminUser = pgTable(
  "admin_user",
  {
    id: serial().primaryKey().notNull(),
    adminId: uuid("admin_id").defaultRandom().notNull(),
    userName: varchar("user_name", { length: 64 }).notNull(),
    isSuperadmin: integer("is_superadmin").default(1),
    mustResetPassword: integer("must_reset_password").default(1),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    lastLoginIp: inet("last_login_ip").default("0.0.0.0").notNull(),
    isActive: integer("is_active").default(1).notNull(),
    loginRetries: integer("login_retries").default(0),
    lockedUntil: timestamp("locked_until", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_admin_id_key").using("btree", table.adminId.asc().nullsLast()),
    unique("admin_user_user_name_key").on(table.userName),
    unique("admin_user_email_key").on(table.email),
  ]
);

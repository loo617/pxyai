import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  const db = drizzle({
    connection: {
      connectionString: env.DATABASE_URL,
    },
    schema,
  });
  console.log("Seeding database ");
  const password = "123456";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await db
    .insert(schema.adminUser)
    .values({
      userName: "admin",
      email: "251803283@qq.com",
      isSuperadmin: 1,
      isActive: 1,
      password: hashedPassword,
    })
    .onConflictDoNothing();
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed");
  console.error(e);
  process.exit(1);
});

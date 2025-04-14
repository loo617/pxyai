import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import { seed } from "drizzle-seed";

async function main() {
  const password = "123456";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const db = drizzle({
    connection: {
      connectionString: env.DATABASE_URL,
    },
    schema,
  });

  await seed(db, schema).refine((f) => ({
    adminUser: {
      count: 5,
      columns: {
        password: f.default({ defaultValue: hashedPassword }),
        isActive: f.int({ minValue: 0, maxValue: 1 }),
      },
    },
    apiKey: {
      count: 20,
    },
    model: {
      count: 20,
    },
    provider: {
      count: 20,
    },
  }));
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed");
  console.error(e);
  process.exit(1);
});

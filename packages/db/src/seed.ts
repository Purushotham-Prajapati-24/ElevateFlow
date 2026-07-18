import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, accounts } from "./schema/index";
import { eq, and } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

/**
 * Seed script for ElevateFlow development.
 *
 * Creates 4 users with fixed roles and the password "password123".
 * Better Auth stores passwords in the `account` table with provider "credential".
 *
 * This script is idempotent — it checks for existing users and updates their password hash.
 */

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

interface SeedUser {
  email: string;
  name: string;
  role: "viewer" | "author" | "reviewer" | "admin";
}

const SEED_USERS: SeedUser[] = [
  {
    email: "alice@elevateflow.dev",
    name: "Alice Author",
    role: "author",
  },
  {
    email: "bob@elevateflow.dev",
    name: "Bob Reviewer",
    role: "reviewer",
  },
  {
    email: "charlie@elevateflow.dev",
    name: "Charlie Admin",
    role: "admin",
  },
  {
    email: "vera@elevateflow.dev",
    name: "Vera Viewer",
    role: "viewer",
  },
];

const PASSWORD = "password123";

async function seed() {
  console.log("🌱 Seeding ElevateFlow database...\n");

  const hashedPassword = await hashPassword(PASSWORD);

  for (const seedUser of SEED_USERS) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, seedUser.email))
      .limit(1);

    if (existing.length > 0) {
      const user = existing[0];
      if (!user) continue;

      const existingAccount = await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.userId, user.id),
            eq(accounts.providerId, "credential"),
          ),
        )
        .limit(1);

      const acc = existingAccount[0];
      if (acc) {
        await db
          .update(accounts)
          .set({ password: hashedPassword })
          .where(eq(accounts.id, acc.id));
      } else {
        await db.insert(accounts).values({
          id: crypto.randomUUID(),
          userId: user.id,
          accountId: user.id,
          providerId: "credential",
          password: hashedPassword,
        });
      }
      console.log(`  🔄 ${seedUser.name} (${seedUser.email}) — updated password hash`);
      continue;
    }

    const [insertedUser] = await db
      .insert(users)
      .values({
        email: seedUser.email,
        name: seedUser.name,
        role: seedUser.role,
        emailVerified: true,
      })
      .returning();

    if (!insertedUser) {
      throw new Error(`Failed to insert user: ${seedUser.email}`);
    }

    // Create the credential account entry (Better Auth pattern)
    await db.insert(accounts).values({
      id: crypto.randomUUID(),
      userId: insertedUser.id,
      accountId: insertedUser.id,
      providerId: "credential",
      password: hashedPassword,
    });

    console.log(
      `  ✅ ${seedUser.name} (${seedUser.email}) — role: ${seedUser.role}`,
    );
  }

  console.log("\n🌱 Seed complete!");
  console.log("\n📋 Login credentials:");
  console.log("   All users: password123");
  console.log("");

  for (const u of SEED_USERS) {
    console.log(`   ${u.role.padEnd(10)} → ${u.email}`);
  }

  await client.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

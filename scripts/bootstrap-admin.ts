import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const databaseUrl = process.env.DATABASE_URL;

  if (!email || !databaseUrl || process.env.BOOTSTRAP_ADMIN !== "YES") {
    throw new Error(
      "ADMIN_EMAIL, DATABASE_URL, and BOOTSTRAP_ADMIN=YES are required",
    );
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
    }),
  });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new Error("Admin account must be registered and active");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: "SUPER_ADMIN",
      },
    });

    console.log(`Successfully assigned SUPER_ADMIN to ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

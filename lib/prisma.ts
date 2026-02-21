import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    // If running in a context where env vars aren't loaded (like build time sometimes), 
    // we should handle gracefully or ensure they are loaded.
    // However, for runtime, this is critical.
    if (typeof window === 'undefined') { // Server-side check
         console.warn("Messed up env: DATABASE_URL is missing");
    }
  }

  // Fallback to avoid crash during build if env is missing, though runtime needs it
  const connectionString = process.env.DATABASE_URL || "";

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


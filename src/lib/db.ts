import { PrismaClient } from "@prisma/client";

// Singleton de Prisma: evita abrir una conexión nueva en cada hot-reload
// durante desarrollo (patrón estándar de Next.js + Prisma).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

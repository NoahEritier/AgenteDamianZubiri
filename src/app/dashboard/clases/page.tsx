import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type ClaseConGrupo = Prisma.ClaseGetPayload<{ include: { grupo: true } }>;

export default async function ClasesPage() {
  let clases: ClaseConGrupo[] = [];
  let error: string | null = null;

  try {
    clases = await db.clase.findMany({
      include: { grupo: true },
      orderBy: { fecha: "desc" },
    });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Clases
        </h1>
        <Link
          href="/dashboard/clases/nueva"
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Nueva clase
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {clases.map((clase) => (
          <li key={clase.id}>
            <Link
              href={`/dashboard/clases/${clase.id}`}
              className="flex items-center justify-between py-3 hover:opacity-70"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {clase.grupo.nombre}
                </p>
                <p className="text-sm text-zinc-500">
                  {clase.fecha.toLocaleDateString("es-AR")}
                  {clase.contenido ? ` · ${clase.contenido}` : ""}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {clases.length === 0 && !error && (
        <p className="mt-6 text-sm text-zinc-500">
          Todavía no hay clases cargadas.
        </p>
      )}
    </div>
  );
}

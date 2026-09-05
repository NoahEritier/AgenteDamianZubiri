import Link from "next/link";
import type { Competencia } from "@prisma/client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CompetenciasPage() {
  let competencias: Competencia[] = [];
  let error: string | null = null;

  try {
    competencias = await db.competencia.findMany({
      orderBy: { fecha: "asc" },
    });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Competencias
        </h1>
        <Link
          href="/dashboard/competencias/nueva"
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Nueva competencia
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {competencias.map((competencia) => (
          <li key={competencia.id}>
            <Link
              href={`/dashboard/competencias/${competencia.id}`}
              className="flex items-center justify-between py-3 hover:opacity-70"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {competencia.nombre}
                </p>
                <p className="text-sm text-zinc-500">
                  {competencia.fecha.toLocaleDateString("es-AR")}
                  {competencia.lugar ? ` · ${competencia.lugar}` : ""}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {competencias.length === 0 && !error && (
        <p className="mt-6 text-sm text-zinc-500">
          Todavía no hay competencias cargadas.
        </p>
      )}
    </div>
  );
}

import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { DISCIPLINA_LABEL } from "./_components/grupo-form";

export const dynamic = "force-dynamic";

type GrupoConSede = Prisma.GrupoGetPayload<{ include: { sede: true } }>;

export default async function GruposPage() {
  let grupos: GrupoConSede[] = [];
  let error: string | null = null;

  try {
    grupos = await db.grupo.findMany({
      include: { sede: true },
      orderBy: { nombre: "asc" },
    });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Grupos
        </h1>
        <Link
          href="/dashboard/grupos/nuevo"
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Nuevo grupo
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {grupos.map((grupo) => (
          <li key={grupo.id}>
            <Link
              href={`/dashboard/grupos/${grupo.id}`}
              className="flex items-center justify-between py-3 hover:opacity-70"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {grupo.nombre}
                </p>
                <p className="text-sm text-zinc-500">
                  {DISCIPLINA_LABEL[grupo.disciplina]}
                  {grupo.horario ? ` · ${grupo.horario}` : ""}
                  {grupo.sede ? ` · ${grupo.sede.nombre}` : ""}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {grupos.length === 0 && !error && (
        <p className="mt-6 text-sm text-zinc-500">
          Todavía no hay grupos cargados.
        </p>
      )}
    </div>
  );
}

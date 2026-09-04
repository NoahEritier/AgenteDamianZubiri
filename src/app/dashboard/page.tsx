import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

// Panel principal — primer corte: solo el pilar de Alumnos, que fue lo que
// Damián marcó como prioridad #1 en el cuestionario de descubrimiento.
// Cuotas, entrenamientos, competencias y contenido se suman después.

type AlumnoConGrupos = Prisma.AlumnoGetPayload<{
  include: { grupos: { include: { grupo: true } } };
}>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const mostrarInactivos = estado === "inactivos";

  let alumnos: AlumnoConGrupos[] = [];
  let error: string | null = null;

  try {
    alumnos = await db.alumno.findMany({
      where: { activo: !mostrarInactivos },
      include: { grupos: { include: { grupo: true } } },
      orderBy: { apellido: "asc" },
    });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Alumnos
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {alumnos.length} alumno{alumnos.length === 1 ? "" : "s"}{" "}
            {mostrarInactivos ? "dado" : "activo"}
            {alumnos.length === 1 ? "" : "s"}
            {mostrarInactivos ? "s de baja" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/alumnos/nuevo"
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Nuevo alumno
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {alumnos.map((alumno) => (
          <li key={alumno.id}>
            <Link
              href={`/dashboard/alumnos/${alumno.id}`}
              className="flex items-center justify-between py-3 hover:opacity-70"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {alumno.nombre} {alumno.apellido}
                </p>
                <p className="text-sm text-zinc-500">
                  {alumno.nivel ?? "Sin nivel cargado"} ·{" "}
                  {alumno.grupos.map((g) => g.grupo.nombre).join(", ") ||
                    "Sin grupo asignado"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {alumnos.length === 0 && !error && (
        <p className="mt-6 text-sm text-zinc-500">
          {mostrarInactivos
            ? "No hay alumnos dados de baja."
            : "Todavía no hay alumnos cargados."}
        </p>
      )}

      <Link
        href={mostrarInactivos ? "/dashboard" : "/dashboard?estado=inactivos"}
        className="mt-8 inline-block text-sm text-zinc-500 hover:underline"
      >
        {mostrarInactivos
          ? "← Ver alumnos activos"
          : "Ver alumnos dados de baja"}
      </Link>
    </div>
  );
}

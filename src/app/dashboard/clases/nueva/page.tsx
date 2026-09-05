import Link from "next/link";
import { db } from "@/lib/db";
import { crearClase } from "@/lib/actions/clases";

export const dynamic = "force-dynamic";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";
const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export default async function NuevaClasePage() {
  let grupos: Awaited<ReturnType<typeof db.grupo.findMany>> = [];
  let error: string | null = null;

  try {
    grupos = await db.grupo.findMany({ orderBy: { nombre: "asc" } });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/clases"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Nueva clase
      </h1>

      {error && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      {!error && grupos.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">
          Todavía no hay grupos cargados —{" "}
          <Link
            href="/dashboard/grupos/nuevo"
            className="underline hover:no-underline"
          >
            cargá uno primero
          </Link>
          .
        </p>
      )}

      {!error && grupos.length > 0 && (
        <form action={crearClase} className="mt-6 space-y-5">
          <label className={labelClass}>
            Grupo
            <select name="grupoId" required className={inputClass}>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Fecha
            <input
              type="date"
              name="fecha"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Contenido dado
            <textarea
              name="contenido"
              rows={3}
              placeholder="Ej: guardia cerrada, pasaje de guardia..."
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Notas
            <textarea name="notas" rows={3} className={inputClass} />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/dashboard/clases"
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Crear clase
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

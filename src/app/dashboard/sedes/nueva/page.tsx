import Link from "next/link";
import { crearSede } from "@/lib/actions/sedes";

export default function NuevaSedePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/sedes"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Nueva sede
      </h1>

      <form action={crearSede} className="mt-6 space-y-5">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nombre
          <input
            type="text"
            name="nombre"
            required
            placeholder="Ej: Espacio propio, Polideportivo..."
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Dirección
          <input
            type="text"
            name="direccion"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/dashboard/sedes"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Crear sede
          </button>
        </div>
      </form>
    </div>
  );
}

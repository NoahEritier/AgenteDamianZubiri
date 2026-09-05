import Link from "next/link";
import { generarCuotasDelMes } from "@/lib/actions/cuotas";

function periodoActual() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}`;
}

export default function GenerarCuotasDelMesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/cuotas"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Generar cuotas del mes
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Crea una cuota con este monto y vencimiento para cada alumno activo
        que todavía no tenga una cuota cargada para ese período — no
        duplica las que ya existen.
      </p>

      <form action={generarCuotasDelMes} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Período
            <input
              type="text"
              name="periodo"
              required
              defaultValue={periodoActual()}
              placeholder="2026-09"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Monto
            <input
              type="number"
              name="monto"
              required
              min="0"
              step="0.01"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Fecha de vencimiento
            <input
              type="date"
              name="fechaVencimiento"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/dashboard/cuotas"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Generar cuotas
          </button>
        </div>
      </form>
    </div>
  );
}

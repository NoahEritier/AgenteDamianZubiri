import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { actualizarSede } from "@/lib/actions/sedes";

export default async function SedePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sede = await db.sede.findUnique({ where: { id } });
  if (!sede) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/sedes"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {sede.nombre}
      </h1>

      <form action={actualizarSede} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={sede.id} />
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nombre
          <input
            type="text"
            name="nombre"
            required
            defaultValue={sede.nombre}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Dirección
          <input
            type="text"
            name="direccion"
            defaultValue={sede.direccion ?? ""}
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
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}

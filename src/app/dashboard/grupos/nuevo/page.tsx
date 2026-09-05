import Link from "next/link";
import { db } from "@/lib/db";
import { crearGrupo } from "@/lib/actions/grupos";
import { GrupoForm } from "../_components/grupo-form";

export const dynamic = "force-dynamic";

export default async function NuevoGrupoPage() {
  let sedes: Awaited<ReturnType<typeof db.sede.findMany>> = [];
  let error: string | null = null;

  try {
    sedes = await db.sede.findMany({ orderBy: { nombre: "asc" } });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/grupos"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Nuevo grupo
      </h1>

      {error ? (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      ) : (
        <GrupoForm
          action={crearGrupo}
          sedes={sedes}
          submitLabel="Crear grupo"
        />
      )}
    </div>
  );
}

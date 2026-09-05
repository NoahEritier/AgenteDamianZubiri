import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { actualizarGrupo } from "@/lib/actions/grupos";
import { GrupoForm } from "../_components/grupo-form";

export default async function GrupoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [grupo, sedes] = await Promise.all([
    db.grupo.findUnique({ where: { id } }),
    db.sede.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  if (!grupo) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/grupos"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {grupo.nombre}
      </h1>

      <GrupoForm
        action={actualizarGrupo}
        sedes={sedes}
        submitLabel="Guardar cambios"
        defaultValues={{
          id: grupo.id,
          nombre: grupo.nombre,
          disciplina: grupo.disciplina,
          horario: grupo.horario ?? "",
          sedeId: grupo.sedeId ?? "",
        }}
      />
    </div>
  );
}

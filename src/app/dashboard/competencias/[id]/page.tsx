import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { actualizarCompetencia } from "@/lib/actions/competencias";
import { CompetenciaForm } from "../_components/competencia-form";

export default async function CompetenciaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const competencia = await db.competencia.findUnique({ where: { id } });
  if (!competencia) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/competencias"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {competencia.nombre}
      </h1>

      <CompetenciaForm
        action={actualizarCompetencia}
        submitLabel="Guardar cambios"
        defaultValues={{
          id: competencia.id,
          nombre: competencia.nombre,
          fecha: competencia.fecha.toISOString().slice(0, 10),
          lugar: competencia.lugar ?? "",
          inscripcionHasta: competencia.inscripcionHasta
            ? competencia.inscripcionHasta.toISOString().slice(0, 10)
            : "",
        }}
      />
    </div>
  );
}

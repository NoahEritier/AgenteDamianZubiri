import Link from "next/link";
import { crearCompetencia } from "@/lib/actions/competencias";
import { CompetenciaForm } from "../_components/competencia-form";

export default function NuevaCompetenciaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/competencias"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Nueva competencia
      </h1>
      <CompetenciaForm
        action={crearCompetencia}
        submitLabel="Crear competencia"
      />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { registrarAsistencia } from "@/lib/actions/clases";

export default async function ClasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const clase = await db.clase.findUnique({
    where: { id },
    include: { grupo: true, asistencias: true },
  });
  if (!clase) notFound();

  const alumnosDelGrupo = await db.alumnoGrupo.findMany({
    where: { grupoId: clase.grupoId },
    include: { alumno: true },
    orderBy: { alumno: { apellido: "asc" } },
  });

  const asistenciaPorAlumno = new Map(
    clase.asistencias.map((a) => [a.alumnoId, a.presente])
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard/clases"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {clase.grupo.nombre}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {clase.fecha.toLocaleDateString("es-AR")}
      </p>

      {clase.contenido && (
        <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
          <span className="font-medium">Contenido: </span>
          {clase.contenido}
        </p>
      )}
      {clase.notas && (
        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
          <span className="font-medium">Notas: </span>
          {clase.notas}
        </p>
      )}

      <section className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Asistencia
        </h2>

        {alumnosDelGrupo.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            Este grupo todavía no tiene alumnos asignados.
          </p>
        ) : (
          <form action={registrarAsistencia} className="mt-4 space-y-3">
            <input type="hidden" name="claseId" value={clase.id} />
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {alumnosDelGrupo.map(({ alumno }) => {
                const presente =
                  asistenciaPorAlumno.get(alumno.id) ?? true;
                return (
                  <li
                    key={alumno.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {alumno.nombre} {alumno.apellido}
                    </span>
                    <label className="flex items-center gap-2 text-sm text-zinc-500">
                      <input
                        type="checkbox"
                        name={`presente_${alumno.id}`}
                        defaultChecked={presente}
                        className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
                      />
                      Presente
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Guardar asistencia
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { actualizarAlumno, cambiarEstadoAlumno } from "@/lib/actions/alumnos";
import { AlumnoForm } from "../_components/alumno-form";

export default async function AlumnoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const alumno = await db.alumno.findUnique({
    where: { id },
    include: {
      grupos: { include: { grupo: true } },
      asistencias: {
        include: { clase: true },
        orderBy: { clase: { fecha: "desc" } },
      },
    },
  });

  if (!alumno) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {alumno.nombre} {alumno.apellido}
          </h1>
          {!alumno.activo && (
            <p className="mt-1 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
              Dado de baja
            </p>
          )}
        </div>

        <form action={cambiarEstadoAlumno}>
          <input type="hidden" name="id" value={alumno.id} />
          <input
            type="hidden"
            name="activo"
            value={(!alumno.activo).toString()}
          />
          <button
            type="submit"
            className={
              alumno.activo
                ? "rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                : "rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }
          >
            {alumno.activo ? "Dar de baja" : "Reactivar"}
          </button>
        </form>
      </div>

      <AlumnoForm
        action={actualizarAlumno}
        submitLabel="Guardar cambios"
        defaultValues={{
          id: alumno.id,
          nombre: alumno.nombre,
          apellido: alumno.apellido,
          telefono: alumno.telefono ?? "",
          email: alumno.email ?? "",
          nivel: alumno.nivel ?? "",
          fechaIngreso: alumno.fechaIngreso
            ? alumno.fechaIngreso.toISOString().slice(0, 10)
            : "",
          lesiones: alumno.lesiones ?? "",
          objetivos: alumno.objetivos ?? "",
        }}
      />

      <section className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Asistencia
        </h2>
        {alumno.asistencias.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            Sin clases registradas todavía.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-zinc-200 dark:divide-zinc-800">
            {alumno.asistencias.map((asistencia) => (
              <li
                key={asistencia.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="text-zinc-700 dark:text-zinc-300">
                  {asistencia.clase.fecha.toLocaleDateString("es-AR")}
                </span>
                <span
                  className={
                    asistencia.presente
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-zinc-500"
                  }
                >
                  {asistencia.presente ? "Presente" : "Ausente"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

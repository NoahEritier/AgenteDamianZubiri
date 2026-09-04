import Link from "next/link";
import { crearAlumno } from "@/lib/actions/alumnos";
import { AlumnoForm } from "../_components/alumno-form";

export default function NuevoAlumnoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Volver
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Nuevo alumno
      </h1>
      <AlumnoForm action={crearAlumno} submitLabel="Crear alumno" />
    </div>
  );
}

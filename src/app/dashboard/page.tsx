import { db } from "@/lib/db";

// Panel principal — primer corte: solo el pilar de Alumnos, que fue lo que
// Damián marcó como prioridad #1 en el cuestionario de descubrimiento.
// Cuotas, entrenamientos, competencias y contenido se suman después.
//
// Nota: el tipo de abajo se escribe a mano (en vez de usar Prisma.AlumnoGetPayload)
// porque el cliente de Prisma recién se genera con `npx prisma generate`, que
// no corrió en este entorno — ver README, sección "Poner esto a andar".

type AlumnoConGrupos = {
  id: string;
  nombre: string;
  apellido: string;
  nivel: string | null;
  grupos: { grupo: { nombre: string } }[];
};

export default async function DashboardPage() {
  let alumnos: AlumnoConGrupos[] = [];
  let error: string | null = null;

  try {
    alumnos = await db.alumno.findMany({
      where: { activo: true },
      include: { grupos: { include: { grupo: true } } },
      orderBy: { apellido: "asc" },
    });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Alumnos
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {alumnos.length} alumno{alumnos.length === 1 ? "" : "s"} activo
        {alumnos.length === 1 ? "" : "s"}
      </p>

      {error && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {alumnos.map((alumno) => (
          <li key={alumno.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {alumno.nombre} {alumno.apellido}
              </p>
              <p className="text-sm text-zinc-500">
                {alumno.nivel ?? "Sin nivel cargado"} ·{" "}
                {alumno.grupos.map((g) => g.grupo.nombre).join(", ") ||
                  "Sin grupo asignado"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

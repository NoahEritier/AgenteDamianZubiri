import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { marcarCuotaPagada } from "@/lib/actions/cuotas";

// Prioridad #3: una vista de quién debe, de un vistazo. Muestra toda cuota
// que no esté pagada (pendiente o vencida), la más urgente primero.

type CuotaConAlumno = Prisma.CuotaGetPayload<{ include: { alumno: true } }>;

const formatMonto = (monto: Prisma.Decimal | number | string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(monto));

const formatFecha = (fecha: Date) => fecha.toLocaleDateString("es-AR");

export default async function CuotasPage() {
  let cuotas: CuotaConAlumno[] = [];
  let error: string | null = null;

  try {
    cuotas = await db.cuota.findMany({
      where: { estado: { not: "PAGADA" } },
      include: { alumno: true },
      orderBy: { fechaVencimiento: "asc" },
    });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const vencidas = cuotas.filter((c) => c.fechaVencimiento < hoy);
  const totalAdeudado = cuotas.reduce((acc, c) => acc + Number(c.monto), 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Cuotas
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {cuotas.length === 0
              ? "Nadie debe cuotas."
              : `${cuotas.length} cuota${cuotas.length === 1 ? "" : "s"} sin pagar (${vencidas.length} vencida${vencidas.length === 1 ? "" : "s"}) · ${formatMonto(totalAdeudado)} en total`}
          </p>
        </div>
        <Link
          href="/dashboard/cuotas/nueva"
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Nueva cuota
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {cuotas.map((cuota) => {
          const estaVencida = cuota.fechaVencimiento < hoy;
          return (
            <li
              key={cuota.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  <Link
                    href={`/dashboard/alumnos/${cuota.alumnoId}`}
                    className="hover:underline"
                  >
                    {cuota.alumno.nombre} {cuota.alumno.apellido}
                  </Link>
                </p>
                <p className="text-sm text-zinc-500">
                  {cuota.periodo} · {formatMonto(cuota.monto)} · vence{" "}
                  {formatFecha(cuota.fechaVencimiento)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={
                    estaVencida
                      ? "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                      : "rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  }
                >
                  {estaVencida ? "Vencida" : "Pendiente"}
                </span>

                <form
                  action={marcarCuotaPagada}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="id" value={cuota.id} />
                  <select
                    name="medioPago"
                    defaultValue="EFECTIVO"
                    className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="MERCADO_PAGO">Mercado Pago</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-full border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
                  >
                    Marcar pagada
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>

      {cuotas.length === 0 && !error && (
        <p className="mt-6 text-sm text-zinc-500">
          No hay cuotas pendientes cargadas.
        </p>
      )}
    </div>
  );
}

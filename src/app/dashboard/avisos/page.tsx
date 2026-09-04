import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { enviarAviso, generarAvisosCuotasVencidas } from "@/lib/actions/avisos";

// Avisos de cuota por WhatsApp Cloud API. Decisión de Noah (no era pedido
// explícito de Damián — él dijo que prefiere el contacto personal): por
// ahora el aviso le llega primero a Damián, no directo al alumno, hasta
// que se confirme el criterio con él.

// Sin esto queda prerenderizada estática en build y la lista de avisos no
// se actualiza en producción.
export const dynamic = "force-dynamic";

type AvisoConCuota = Prisma.AvisoWhatsappGetPayload<{
  include: { cuota: { include: { alumno: true } } };
}>;

const estadoBadge: Record<string, string> = {
  PENDIENTE:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  ENVIADO:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  FALLIDO: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const estadoLabel: Record<string, string> = {
  PENDIENTE: "Pendiente de enviar",
  ENVIADO: "Enviado",
  FALLIDO: "Falló el envío",
};

export default async function AvisosPage() {
  let avisos: AvisoConCuota[] = [];
  let error: string | null = null;

  try {
    avisos = await db.avisoWhatsapp.findMany({
      include: { cuota: { include: { alumno: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    error =
      "No hay conexión a la base de datos todavía — configurá DATABASE_URL en .env y corré `npx prisma migrate dev`.";
  }

  const damianPhoneConfigurado = Boolean(process.env.WHATSAPP_DAMIAN_PHONE);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Avisos
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Por ahora los recordatorios de cuota vencida te llegan a vos por
            WhatsApp, no directo al alumno.
          </p>
        </div>
        <form action={generarAvisosCuotasVencidas}>
          <button
            type="submit"
            disabled={!damianPhoneConfigurado}
            className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Generar avisos de cuotas vencidas
          </button>
        </form>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      {!damianPhoneConfigurado && (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Falta configurar <code>WHATSAPP_DAMIAN_PHONE</code> en el .env — es
          el número al que van a llegar estos avisos por ahora.
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
        {avisos.map((aviso) => (
          <li key={aviso.id} className="flex flex-col gap-2 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {aviso.cuota
                  ? `${aviso.cuota.alumno.nombre} ${aviso.cuota.alumno.apellido} — ${aviso.cuota.periodo}`
                  : "Aviso sin cuota asociada"}
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${estadoBadge[aviso.estado]}`}
              >
                {estadoLabel[aviso.estado]}
              </span>
            </div>
            <p className="text-sm text-zinc-500">{aviso.mensaje}</p>
            {aviso.estado !== "ENVIADO" && (
              <form action={enviarAviso}>
                <input type="hidden" name="id" value={aviso.id} />
                <button
                  type="submit"
                  className="mt-1 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Enviar por WhatsApp
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>

      {avisos.length === 0 && !error && (
        <p className="mt-6 text-sm text-zinc-500">
          Todavía no hay avisos generados. Usá &quot;Generar avisos de cuotas
          vencidas&quot; para crear uno por cada cuota vencida sin aviso
          pendiente.
        </p>
      )}
    </div>
  );
}

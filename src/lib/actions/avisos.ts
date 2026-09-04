"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { enviarPlantillaWhatsapp } from "@/lib/whatsapp";

// Decisión de Noah: por ahora el aviso de cuota vencida llega primero a
// Damián (no directo al alumno) — Damián dijo que prefiere el contacto
// personal, así que hasta que se confirme el criterio exacto, esto es un
// recordatorio PARA Damián, no un mensaje automático al alumno.

const PLANTILLA_RECORDATORIO_CUOTA = "recordatorio_cuota";

function formatMonto(monto: unknown) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(monto));
}

export async function generarAvisosCuotasVencidas() {
  const destinatario = process.env.WHATSAPP_DAMIAN_PHONE;
  if (!destinatario) {
    throw new Error(
      "Falta WHATSAPP_DAMIAN_PHONE en el .env — es el número de Damián al que van a llegar los avisos por ahora."
    );
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const cuotasVencidas = await db.cuota.findMany({
    where: {
      estado: { not: "PAGADA" },
      fechaVencimiento: { lt: hoy },
      avisos: { none: { estado: { in: ["PENDIENTE", "ENVIADO"] } } },
    },
    include: { alumno: true },
  });

  for (const cuota of cuotasVencidas) {
    await db.avisoWhatsapp.create({
      data: {
        tipo: "RECORDATORIO_CUOTA",
        destinatario,
        mensaje: `${cuota.alumno.nombre} ${cuota.alumno.apellido} debe la cuota de ${cuota.periodo} (${formatMonto(cuota.monto)}), venció el ${cuota.fechaVencimiento.toLocaleDateString("es-AR")}.`,
        cuotaId: cuota.id,
      },
    });
  }

  revalidatePath("/dashboard/avisos");
}

export async function enviarAviso(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Falta el id del aviso.");

  const aviso = await db.avisoWhatsapp.findUnique({ where: { id } });
  if (!aviso) throw new Error("No se encontró el aviso.");

  try {
    await enviarPlantillaWhatsapp({
      destinatario: aviso.destinatario,
      plantilla: PLANTILLA_RECORDATORIO_CUOTA,
      parametros: [aviso.mensaje],
    });
    await db.avisoWhatsapp.update({
      where: { id },
      data: { estado: "ENVIADO", enviadoAt: new Date() },
    });
  } catch (err) {
    console.error("Error enviando aviso de WhatsApp:", err);
    await db.avisoWhatsapp.update({
      where: { id },
      data: { estado: "FALLIDO" },
    });
  }

  revalidatePath("/dashboard/avisos");
}

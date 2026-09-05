"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { MedioPago } from "@prisma/client";

export async function crearCuota(formData: FormData) {
  const alumnoId = String(formData.get("alumnoId") ?? "").trim();
  const periodo = String(formData.get("periodo") ?? "").trim();
  const monto = String(formData.get("monto") ?? "").trim();
  const fechaVencimiento = String(
    formData.get("fechaVencimiento") ?? ""
  ).trim();

  if (!alumnoId || !periodo || !monto || !fechaVencimiento) {
    throw new Error("Faltan datos obligatorios para crear la cuota.");
  }
  if (Number.isNaN(Number(monto))) {
    throw new Error("El monto tiene que ser un número.");
  }

  await db.cuota.create({
    data: {
      alumnoId,
      periodo,
      monto,
      fechaVencimiento: new Date(fechaVencimiento),
    },
  });

  revalidatePath("/dashboard/cuotas");
  redirect("/dashboard/cuotas");
}

export async function generarCuotasDelMes(formData: FormData) {
  const periodo = String(formData.get("periodo") ?? "").trim();
  const monto = String(formData.get("monto") ?? "").trim();
  const fechaVencimiento = String(
    formData.get("fechaVencimiento") ?? ""
  ).trim();

  if (!periodo || !monto || !fechaVencimiento) {
    throw new Error("Faltan datos obligatorios para generar las cuotas.");
  }
  if (Number.isNaN(Number(monto))) {
    throw new Error("El monto tiene que ser un número.");
  }

  const alumnosActivos = await db.alumno.findMany({
    where: {
      activo: true,
      cuotas: { none: { periodo } },
    },
    select: { id: true },
  });

  if (alumnosActivos.length > 0) {
    await db.cuota.createMany({
      data: alumnosActivos.map(({ id: alumnoId }) => ({
        alumnoId,
        periodo,
        monto,
        fechaVencimiento: new Date(fechaVencimiento),
      })),
    });
  }

  revalidatePath("/dashboard/cuotas");
  redirect("/dashboard/cuotas");
}

export async function marcarCuotaPagada(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const medioPagoRaw = String(formData.get("medioPago") ?? "");
  if (!id) throw new Error("Falta el id de la cuota.");

  await db.cuota.update({
    where: { id },
    data: {
      estado: "PAGADA",
      fechaPago: new Date(),
      medioPago: medioPagoRaw ? (medioPagoRaw as MedioPago) : null,
    },
  });

  revalidatePath("/dashboard/cuotas");
  redirect("/dashboard/cuotas");
}

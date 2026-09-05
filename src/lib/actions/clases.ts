"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function crearClase(formData: FormData) {
  const grupoId = String(formData.get("grupoId") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const contenido = String(formData.get("contenido") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();

  if (!grupoId || !fecha) {
    throw new Error("Faltan el grupo o la fecha de la clase.");
  }

  const clase = await db.clase.create({
    data: {
      grupoId,
      fecha: new Date(fecha),
      contenido: contenido || null,
      notas: notas || null,
    },
  });

  revalidatePath("/dashboard/clases");
  redirect(`/dashboard/clases/${clase.id}`);
}

export async function registrarAsistencia(formData: FormData) {
  const claseId = String(formData.get("claseId") ?? "");
  if (!claseId) throw new Error("Falta el id de la clase.");

  const clase = await db.clase.findUnique({ where: { id: claseId } });
  if (!clase) throw new Error("No se encontró la clase.");

  // Se recalcula acá qué alumnos pertenecen al grupo, en vez de confiar en
  // una lista mandada por el cliente — así nadie puede colar un alumnoId
  // que no sea de este grupo.
  const alumnosDelGrupo = await db.alumnoGrupo.findMany({
    where: { grupoId: clase.grupoId },
    select: { alumnoId: true },
  });

  await db.$transaction(
    alumnosDelGrupo.map(({ alumnoId }) => {
      const presente = formData.get(`presente_${alumnoId}`) === "on";
      return db.asistencia.upsert({
        where: { claseId_alumnoId: { claseId, alumnoId } },
        create: { claseId, alumnoId, presente },
        update: { presente },
      });
    })
  );

  revalidatePath(`/dashboard/clases/${claseId}`);
  redirect(`/dashboard/clases/${claseId}`);
}

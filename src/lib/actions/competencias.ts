"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseCompetenciaForm(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const lugar = String(formData.get("lugar") ?? "").trim();
  const inscripcionHasta = String(
    formData.get("inscripcionHasta") ?? ""
  ).trim();

  if (!nombre || !fecha) {
    throw new Error("El nombre y la fecha de la competencia son obligatorios.");
  }

  return {
    nombre,
    fecha: new Date(fecha),
    lugar: lugar || null,
    inscripcionHasta: inscripcionHasta ? new Date(inscripcionHasta) : null,
  };
}

export async function crearCompetencia(formData: FormData) {
  const data = parseCompetenciaForm(formData);
  await db.competencia.create({ data });

  revalidatePath("/dashboard/competencias");
  redirect("/dashboard/competencias");
}

export async function actualizarCompetencia(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Falta el id de la competencia.");

  const data = parseCompetenciaForm(formData);
  await db.competencia.update({ where: { id }, data });

  revalidatePath("/dashboard/competencias");
  redirect("/dashboard/competencias");
}

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Disciplina } from "@prisma/client";

const DISCIPLINAS: Disciplina[] = ["JIU_JITSU", "BOX", "FUNCIONAL"];

function parseGrupoForm(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const disciplina = String(formData.get("disciplina") ?? "") as Disciplina;
  const horario = String(formData.get("horario") ?? "").trim();
  const sedeId = String(formData.get("sedeId") ?? "").trim();

  if (!nombre) {
    throw new Error("El nombre del grupo es obligatorio.");
  }
  if (!DISCIPLINAS.includes(disciplina)) {
    throw new Error("La disciplina no es válida.");
  }

  return {
    nombre,
    disciplina,
    horario: horario || null,
    sedeId: sedeId || null,
  };
}

export async function crearGrupo(formData: FormData) {
  const data = parseGrupoForm(formData);
  await db.grupo.create({ data });

  revalidatePath("/dashboard/grupos");
  redirect("/dashboard/grupos");
}

export async function actualizarGrupo(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Falta el id del grupo.");

  const data = parseGrupoForm(formData);
  await db.grupo.update({ where: { id }, data });

  revalidatePath("/dashboard/grupos");
  redirect("/dashboard/grupos");
}

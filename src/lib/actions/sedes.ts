"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseSedeForm(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();

  if (!nombre) {
    throw new Error("El nombre de la sede es obligatorio.");
  }

  return { nombre, direccion: direccion || null };
}

export async function crearSede(formData: FormData) {
  const data = parseSedeForm(formData);
  await db.sede.create({ data });

  revalidatePath("/dashboard/sedes");
  redirect("/dashboard/sedes");
}

export async function actualizarSede(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Falta el id de la sede.");

  const data = parseSedeForm(formData);
  await db.sede.update({ where: { id }, data });

  revalidatePath("/dashboard/sedes");
  redirect("/dashboard/sedes");
}

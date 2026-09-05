"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseAlumnoForm(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "").trim();
  const fechaIngreso = String(formData.get("fechaIngreso") ?? "").trim();
  const lesiones = String(formData.get("lesiones") ?? "").trim();
  const objetivos = String(formData.get("objetivos") ?? "").trim();

  if (!nombre || !apellido) {
    throw new Error("Nombre y apellido son obligatorios.");
  }

  return {
    nombre,
    apellido,
    telefono: telefono || null,
    email: email || null,
    nivel: nivel || null,
    fechaIngreso: fechaIngreso ? new Date(fechaIngreso) : null,
    lesiones: lesiones || null,
    objetivos: objetivos || null,
  };
}

export async function crearAlumno(formData: FormData) {
  const data = parseAlumnoForm(formData);
  const alumno = await db.alumno.create({ data });

  revalidatePath("/dashboard");
  redirect(`/dashboard/alumnos/${alumno.id}`);
}

export async function actualizarAlumno(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Falta el id del alumno.");

  const data = parseAlumnoForm(formData);
  await db.alumno.update({ where: { id }, data });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/alumnos/${id}`);
  redirect(`/dashboard/alumnos/${id}`);
}

export async function cambiarEstadoAlumno(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const activo = formData.get("activo") === "true";
  if (!id) throw new Error("Falta el id del alumno.");

  await db.alumno.update({ where: { id }, data: { activo } });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/alumnos/${id}`);
  redirect(`/dashboard/alumnos/${id}`);
}

export async function asignarGrupo(formData: FormData) {
  const alumnoId = String(formData.get("alumnoId") ?? "");
  const grupoId = String(formData.get("grupoId") ?? "");
  if (!alumnoId || !grupoId) {
    throw new Error("Falta el alumno o el grupo.");
  }

  await db.alumnoGrupo.upsert({
    where: { alumnoId_grupoId: { alumnoId, grupoId } },
    create: { alumnoId, grupoId },
    update: {},
  });

  revalidatePath(`/dashboard/alumnos/${alumnoId}`);
  redirect(`/dashboard/alumnos/${alumnoId}`);
}

export async function quitarGrupo(formData: FormData) {
  const alumnoId = String(formData.get("alumnoId") ?? "");
  const grupoId = String(formData.get("grupoId") ?? "");
  if (!alumnoId || !grupoId) {
    throw new Error("Falta el alumno o el grupo.");
  }

  await db.alumnoGrupo.delete({
    where: { alumnoId_grupoId: { alumnoId, grupoId } },
  });

  revalidatePath(`/dashboard/alumnos/${alumnoId}`);
  redirect(`/dashboard/alumnos/${alumnoId}`);
}

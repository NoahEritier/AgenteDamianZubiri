-- CreateEnum
CREATE TYPE "Disciplina" AS ENUM ('JIU_JITSU', 'BOX', 'FUNCIONAL');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('PENDIENTE', 'PAGADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "MedioPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'MERCADO_PAGO');

-- CreateEnum
CREATE TYPE "EstadoIdea" AS ENUM ('PENDIENTE', 'PUBLICADA', 'DESCARTADA');

-- CreateEnum
CREATE TYPE "TipoAviso" AS ENUM ('RECORDATORIO_CUOTA', 'RESUMEN_DIARIO', 'RESUMEN_SEMANAL', 'COMPETENCIA');

-- CreateEnum
CREATE TYPE "EstadoAviso" AS ENUM ('PENDIENTE', 'ENVIADO', 'FALLIDO');

-- CreateTable
CREATE TABLE "Sede" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "disciplina" "Disciplina" NOT NULL,
    "horario" TEXT,
    "sedeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumno" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "nivel" TEXT,
    "fechaIngreso" TIMESTAMP(3),
    "lesiones" TEXT,
    "objetivos" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumnoGrupo" (
    "alumnoId" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,

    CONSTRAINT "AlumnoGrupo_pkey" PRIMARY KEY ("alumnoId","grupoId")
);

-- CreateTable
CREATE TABLE "Clase" (
    "id" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "contenido" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" TEXT NOT NULL,
    "claseId" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuota" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "estado" "EstadoCuota" NOT NULL DEFAULT 'PENDIENTE',
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "fechaPago" TIMESTAMP(3),
    "medioPago" "MedioPago",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competencia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "lugar" TEXT,
    "inscripcionHasta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Competencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumnoCompetencia" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "competenciaId" TEXT NOT NULL,
    "categoria" TEXT,
    "objetivo" TEXT,
    "resultado" TEXT,

    CONSTRAINT "AlumnoCompetencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaContenido" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "origen" TEXT,
    "estado" "EstadoIdea" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaContenido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvisoWhatsapp" (
    "id" TEXT NOT NULL,
    "tipo" "TipoAviso" NOT NULL,
    "destinatario" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "cuotaId" TEXT,
    "estado" "EstadoAviso" NOT NULL DEFAULT 'PENDIENTE',
    "enviadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvisoWhatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_claseId_alumnoId_key" ON "Asistencia"("claseId", "alumnoId");

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumnoGrupo" ADD CONSTRAINT "AlumnoGrupo_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumnoGrupo" ADD CONSTRAINT "AlumnoGrupo_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clase" ADD CONSTRAINT "Clase_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "Clase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuota" ADD CONSTRAINT "Cuota_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumnoCompetencia" ADD CONSTRAINT "AlumnoCompetencia_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumnoCompetencia" ADD CONSTRAINT "AlumnoCompetencia_competenciaId_fkey" FOREIGN KEY ("competenciaId") REFERENCES "Competencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisoWhatsapp" ADD CONSTRAINT "AvisoWhatsapp_cuotaId_fkey" FOREIGN KEY ("cuotaId") REFERENCES "Cuota"("id") ON DELETE SET NULL ON UPDATE CASCADE;

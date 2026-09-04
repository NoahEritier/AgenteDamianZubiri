# Secretario Tropa BJJ

Secretario digital a medida para Damián Zubiri (Tropa Jiu-Jitsu — jiu-jitsu,
box y funcional). Primer caso de uso real del modelo de agentes por rubro de
Codice: alumnos, cuotas, entrenamientos, competencias, contenido y avisos por
WhatsApp, todo en un solo lugar.

Este repo arranca en construcción — es el punto de partida para seguir
iterando (idealmente desde Claude Code, ver más abajo).

## Por qué estas decisiones

- **Next.js (App Router) + TypeScript**: un solo lenguaje y un solo repo para
  panel web y backend (route handlers), aprovechando que ya es stack conocido.
- **Prisma + PostgreSQL**: falta decidir dónde hostear la base — Supabase es
  el candidato más simple para arrancar (tier gratuito, Postgres real, fácil
  de migrar después).
- **WhatsApp Cloud API (Meta), oficial**: decisión de Noah — a pesar de que
  Damián dijo preferir el contacto personal antes que avisos automáticos, se
  van a incluir igual. Se eligió la API oficial (y no una librería no
  oficial tipo Baileys/whatsapp-web.js) porque no arriesga que le baneen el
  número, y porque este proyecto está pensado para eventualmente replicarse
  a otros rubros/clientes de Codice — ahí una librería no oficial no
  aguantaría.

## Modelo de datos (`prisma/schema.prisma`)

Seis bloques, uno por cada pilar del secretario:

- `Alumno`, `Grupo`, `Sede`, `AlumnoGrupo` — alumnos y su relación con grupos/sedes.
- `Clase`, `Asistencia` — entrenamientos e historial de contenido dado.
- `Cuota` — estado de pago por alumno y período.
- `Competencia`, `AlumnoCompetencia` — calendario y participación.
- `IdeaContenido` — banco de ideas para redes (quedó fuera del MVP, ver abajo).
- `AvisoWhatsapp` — cola de mensajes salientes (recordatorios de cuota, resúmenes).

## Qué entra en el MVP y qué no (según la primera respuesta de Damián)

Entra primero:

1. **Alumnos** — ficha completa (contacto, nivel, ingreso, lesiones, objetivos,
   asistencia). Fue su prioridad #1 explícita, y hoy no tiene ningún registro.
2. **Cuotas** — vista de quién debe, para que Damián lo vea de un vistazo.
3. **Avisos de cuota por WhatsApp** — sumados por decisión de Noah.

Se deja para después:

- Banco de ideas de contenido automático — Damián lo rechazó explícitamente
  en el cuestionario, aunque la constancia para postear sigue siendo un
  problema real para él.
- Multi-usuario / multi-profesor — hoy Damián administra todo solo.

Quedan tres cosas por confirmar con él antes de cerrar el detalle de cuotas —
están anotadas en el documento de descubrimiento (el artefacto que ya tiene
Noah), la más importante es qué es esa "otra cosa" que marcó como su mayor
dolor de cabeza con las cuotas.

## Poner esto a andar

El scaffold original se armó en un entorno sandbox sin salida a
`binaries.prisma.sh` ni a `registry.npmjs.org`, así que faltaban los archivos
de configuración (`package.json`, `tsconfig.json`, `next.config.ts`,
`postcss.config.mjs`, `.gitignore`, `.env.example`) y nunca se había corrido
`npm install` ni `npx prisma generate`. Eso ya se resolvió: se reconstruyeron
esos archivos, `npm install`, `npm run build`, `npm run lint` y
`npx prisma generate` + `npx prisma migrate dev` corrieron de verdad (contra
un Postgres local, para validar el flujo end-to-end antes de apuntar a la
base real).

```bash
npm install

cp .env.example .env
# completar DATABASE_URL (ver Supabase más abajo)

npx prisma generate
npx prisma migrate dev --name init

npm run dev
```

### Base de datos

Más simple para arrancar: crear un proyecto gratis en
[Supabase](https://supabase.com), copiar el connection string de Postgres a
`DATABASE_URL` en `.env`, y correr `npx prisma migrate dev`.

**Pendiente**: todavía no hay un proyecto de Supabase real conectado — hace
falta que Damián o Noah creen el proyecto y pasen el `DATABASE_URL` (via
`.env`, nunca commiteado). Las migraciones ya están escritas y probadas
(`prisma/migrations/`), así que conectar la base real es correr
`npx prisma migrate deploy` (o `migrate dev` si se van a seguir haciendo
cambios de schema) contra ese connection string.

### WhatsApp Cloud API

Para que los avisos de cuota funcionen de verdad hace falta, del lado de
Meta Business Manager:

1. Verificar el negocio (persona/empresa dueña del número de WhatsApp).
2. Dar de alta un número y conseguir `WHATSAPP_PHONE_NUMBER_ID` +
   `WHATSAPP_ACCESS_TOKEN`.
3. Crear y esperar la aprobación de al menos una **plantilla de mensaje**
   (ej. `recordatorio_cuota`) — es obligatorio para poder mandar un mensaje
   que Damián inicia (no una respuesta dentro de las 24hs de una charla).
4. Configurar el webhook (`/api/whatsapp/webhook`, ya armado en este repo)
   en el Business Manager, con el mismo valor de
   `WHATSAPP_WEBHOOK_VERIFY_TOKEN` que tengas en `.env`.

Esto tarda — Meta revisa las plantillas manualmente. Conviene arrancarlo en
paralelo mientras se construye el resto.

## Seguir el desarrollo en Claude Code

Este primer scaffold se armó en Cowork porque no requería nada del lado de
Noah. De acá en adelante conviene mudar el trabajo a **Claude Code**, en tu
compu, apuntando a este mismo repo:

- Vas a necesitar correr `prisma generate` / `migrate` con red normal (acá
  estaba bloqueada), y probar contra una base real.
- Vas a manejar credenciales sensibles (`WHATSAPP_ACCESS_TOKEN`,
  `DATABASE_URL`) que no deberían pasar por un entorno compartido — mejor
  que vivan solo en tu `.env` local.
- Es el mismo flujo que ya usás para otros proyectos de Codice: revisás cada
  diff, corrés tests/build localmente, y el historial de git queda prolijo
  desde el primer commit.

Pasos concretos:

1. Subí este repo a un GitHub privado (`git remote add origin ...` — ya está
   inicializado y con el primer commit hecho).
2. Abrí la carpeta en Claude Code (`claude` desde la terminal, parado en la
   carpeta del proyecto).
3. Empezá por conectar la base de datos y correr las migraciones — es el
   primer bloqueante real para que el panel de Alumnos muestre algo.
4. Después: pantalla para cargar/editar alumnos (hoy el panel solo lista),
   vista de cuotas, y el cron/endpoint que dispara los avisos de WhatsApp.

## Estado actual

- [x] Scaffold Next.js + TypeScript + Tailwind, con `npm install` / `npm run
      build` / `npm run lint` corridos y en verde
- [x] Modelo de datos completo en `prisma/schema.prisma`
- [x] `npx prisma generate` corrido y `npx prisma migrate dev` probado
      end-to-end contra un Postgres real (local, de prueba)
- [x] Cliente de Prisma (`src/lib/db.ts`)
- [x] Cliente mínimo de WhatsApp Cloud API (`src/lib/whatsapp.ts`)
- [x] Webhook de WhatsApp (`src/app/api/whatsapp/webhook/route.ts`)
- [x] Panel de Alumnos (solo lectura, sin datos reales todavía)
- [ ] Conectar la base de datos real (Supabase) — falta el `DATABASE_URL`
      de un proyecto real
- [ ] Alta/edición de alumnos
- [ ] Vista de cuotas + generación de avisos
- [ ] Cuenta de Meta Business verificada y plantilla de WhatsApp aprobada

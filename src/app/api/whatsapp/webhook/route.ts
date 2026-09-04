import { NextRequest, NextResponse } from "next/server";

// Webhook de la WhatsApp Cloud API.
// - GET: Meta lo llama una vez para verificar la URL cuando la configurás
//   en el Business Manager (challenge/response).
// - POST: acá van a llegar los mensajes entrantes de los alumnos (por ahora
//   solo se loguean — más adelante puede servir para que un alumno confirme
//   un pago por WhatsApp, por ejemplo).

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  ) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Verificación fallida", { status: 403 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // TODO: procesar mensajes entrantes (ej. respuestas de alumnos).
  console.log("Webhook de WhatsApp recibido:", JSON.stringify(body));

  return NextResponse.json({ ok: true });
}

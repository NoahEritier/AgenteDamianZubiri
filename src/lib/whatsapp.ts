// Cliente mínimo para la WhatsApp Cloud API (Meta).
//
// Dos formas de mandar mensajes:
// - Mensaje "de sesión" (freeform): solo dentro de las 24hs de la última
//   respuesta del alumno. Sirve para conversación, no para avisos proactivos.
// - Mensaje de "plantilla" (template): la única forma de que Damián inicie
//   una conversación (ej. recordatorio de cuota) fuera de esa ventana de 24hs.
//   Las plantillas se crean y aprueban en Meta Business Manager antes de poder
//   usarlas acá — ver README, sección "WhatsApp".
//
// TODO: cargar WHATSAPP_PHONE_NUMBER_ID y WHATSAPP_ACCESS_TOKEN una vez que
// Noah tenga la cuenta de Meta Business verificada.

const GRAPH_API_VERSION = "v21.0";

type EnviarPlantillaParams = {
  destinatario: string; // E.164, ej "5492235551234"
  plantilla: string; // nombre de la plantilla aprobada en Meta
  parametros?: string[]; // valores para las variables {{1}}, {{2}}, etc.
};

export async function enviarPlantillaWhatsapp({
  destinatario,
  plantilla,
  parametros = [],
}: EnviarPlantillaParams) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error(
      "Faltan WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN en el .env — todavía no está conectada la cuenta de Meta."
    );
  }

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: destinatario,
        type: "template",
        template: {
          name: plantilla,
          language: { code: "es_AR" },
          components: parametros.length
            ? [
                {
                  type: "body",
                  parameters: parametros.map((texto) => ({
                    type: "text",
                    text: texto,
                  })),
                },
              ]
            : undefined,
        },
      }),
    }
  );

  if (!res.ok) {
    const detalle = await res.text();
    throw new Error(`Error enviando WhatsApp (${res.status}): ${detalle}`);
  }

  return res.json();
}

import { NextRequest, NextResponse } from "next/server";

// Protección mínima mientras no hay un sistema de usuarios de verdad: una
// sola contraseña compartida (Basic Auth) para que la app no quede abierta
// a cualquiera con el link — hoy expone teléfonos y lesiones de alumnos.
// Si no está configurada APP_PASSWORD, no bloquea nada (útil en desarrollo).

export function middleware(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!password) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    const suppliedPassword =
      separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : "";
    if (suppliedPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secretario Tropa BJJ"' },
  });
}

export const config = {
  matcher: [
    "/((?!api/whatsapp/webhook|_next/static|_next/image|favicon.ico).*)",
  ],
};

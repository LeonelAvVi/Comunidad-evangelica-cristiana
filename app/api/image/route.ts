import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "res.cloudinary.com",
  "firebasestorage.googleapis.com",
  "firebasestorage.app",
];

function isAllowed(url: URL) {
  return ALLOWED_HOSTS.some(
    (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
  );
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  if (!src) {
    return NextResponse.json({ error: "Falta src" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  if (url.protocol !== "https:" || !isAllowed(url)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 400 });
  }

  const upstream = await fetch(url.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "No se pudo obtener la imagen" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}

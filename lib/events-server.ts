import { isSectorId } from "./sectors";
import type { ChurchEvent } from "./types";

type FirestoreValue =
  | { stringValue: string }
  | { timestampValue: string }
  | { nullValue: null }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean };

type FirestoreDocument = {
  fields?: Record<string, FirestoreValue>;
};

function fieldString(fields: Record<string, FirestoreValue> | undefined, key: string): string {
  const value = fields?.[key];
  if (!value || !("stringValue" in value)) return "";
  return value.stringValue;
}

function fieldStartsAt(fields: Record<string, FirestoreValue> | undefined): string {
  const value = fields?.startsAt;
  if (!value) return "";
  if ("timestampValue" in value) return new Date(value.timestampValue).toISOString();
  if ("stringValue" in value) return value.stringValue;
  return "";
}

function mapEvent(id: string, fields: Record<string, FirestoreValue> | undefined): ChurchEvent | null {
  const title = fieldString(fields, "title");
  const description = fieldString(fields, "description");
  const location = fieldString(fields, "location");
  const sectorRaw = fieldString(fields, "sector");
  const sector = isSectorId(sectorRaw) ? sectorRaw : null;
  const imageRaw = fields?.imageUrl;
  const imageUrl =
    imageRaw && "stringValue" in imageRaw && imageRaw.stringValue ? imageRaw.stringValue : null;
  const startsAt = fieldStartsAt(fields);

  if (!title || !sector || !startsAt) return null;
  return { id, title, description, location, sector, startsAt, imageUrl };
}

/** Lectura server-side vía REST (reglas públicas de lectura) para Open Graph / WhatsApp. */
export async function getEventByIdServer(id: string): Promise<ChurchEvent | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId || !id) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/events/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as FirestoreDocument;
    return mapEvent(id, data.fields);
  } catch {
    return null;
  }
}

export function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://www.comunidadcce.online"
  );
}

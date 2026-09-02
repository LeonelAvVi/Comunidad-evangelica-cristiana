const MONTHS_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const WEEKDAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function parseEventDate(iso: string): Date {
  return new Date(iso);
}

export function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatDay(iso: string): string {
  return pad(parseEventDate(iso).getDate());
}

export function formatMonthShort(iso: string): string {
  return MONTHS_SHORT[parseEventDate(iso).getMonth()];
}

export function formatTime(iso: string): string {
  const date = parseEventDate(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatEventMeta(iso: string, location: string): string {
  const date = parseEventDate(iso);
  const weekday = WEEKDAYS_SHORT[date.getDay()];
  const day = pad(date.getDate());
  const month = MONTHS_SHORT[date.getMonth()].toLowerCase();
  return `${weekday} ${day} ${month} · ${formatTime(iso)} · ${location}`;
}

export function formatShareDate(iso: string, location: string): string {
  return formatEventMeta(iso, location);
}

export function formatLongDate(iso: string): string {
  return parseEventDate(iso).toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function toDatetimeLocal(iso: string): string {
  const date = parseEventDate(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocal(value: string): string {
  return new Date(value).toISOString();
}

export function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export function isUpcoming(iso: string): boolean {
  return parseEventDate(iso).getTime() >= startOfToday().getTime();
}

export function eventPermalink(id: string, origin?: string): string {
  const path = `/eventos/${id}`;
  if (!origin && typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return origin ? `${origin}${path}` : path;
}

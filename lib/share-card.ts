import { SECTORS } from "./sectors";
import { formatEventMeta, formatTime } from "./format";
import type { ChurchEvent } from "./types";

const W = 1080;
const H = 1350;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines && shown.length) {
    shown[shown.length - 1] = `${shown[shown.length - 1].replace(/\s+\S*$/, "")}…`;
  }
  shown.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  return shown.length * lineHeight;
}

function drawRainbow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const colors = ["#D8433B", "#EFB22B", "#3C9146"];
  colors.forEach((color, i) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    const inset = 22 + i * 28;
    ctx.arc(x, y + 40, 90 - inset, Math.PI, 0, false);
    ctx.stroke();
  });
}

async function resolveFonts() {
  const root = getComputedStyle(document.documentElement);
  const serif = root.getPropertyValue("--font-fraunces").trim() || "Fraunces";
  const sans = root.getPropertyValue("--font-inter").trim() || "Inter";
  const mono = root.getPropertyValue("--font-plex").trim() || "IBM Plex Mono";

  await Promise.all([
    document.fonts.load(`700 64px ${serif}`),
    document.fonts.load(`600 28px ${mono}`),
    document.fonts.load(`500 30px ${sans}`),
    document.fonts.load(`400 28px ${sans}`),
  ]);
  await document.fonts.ready;

  return { serif, sans, mono };
}

export async function renderShareCard(
  event: ChurchEvent,
  flyer?: HTMLImageElement | null,
): Promise<Blob> {
  const fonts = await resolveFonts();

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear la tarjeta");

  const sector = SECTORS[event.sector];

  ctx.fillStyle = "#FAFAF7";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = sector.color;
  ctx.fillRect(0, 0, W, 28);

  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 4;
  roundRect(ctx, 48, 72, W - 96, H - 144, 28);
  ctx.stroke();

  let cursorY = 120;

  if (flyer && flyer.naturalWidth > 0) {
    const boxX = 80;
    const boxY = cursorY;
    const boxW = W - 160;
    const boxH = 520;
    ctx.save();
    roundRect(ctx, boxX, boxY, boxW, boxH, 18);
    ctx.clip();
    const scale = Math.max(boxW / flyer.naturalWidth, boxH / flyer.naturalHeight);
    const dw = flyer.naturalWidth * scale;
    const dh = flyer.naturalHeight * scale;
    ctx.drawImage(flyer, boxX + (boxW - dw) / 2, boxY + (boxH - dh) / 2, dw, dh);
    ctx.restore();
    ctx.strokeStyle = "#171717";
    ctx.lineWidth = 3;
    roundRect(ctx, boxX, boxY, boxW, boxH, 18);
    ctx.stroke();
    cursorY = boxY + boxH + 48;
  } else {
    drawRainbow(ctx, W / 2, 150);
    cursorY = 280;
  }

  ctx.fillStyle = sector.color;
  ctx.font = `600 28px ${fonts.mono}, monospace`;
  ctx.fillText(sector.name.toUpperCase(), 88, cursorY);

  cursorY += 64;
  ctx.fillStyle = "#175A82";
  ctx.font = `700 64px ${fonts.serif}, serif`;
  cursorY += wrapText(ctx, event.title, 88, cursorY, W - 176, 72, 3);

  cursorY += 36;
  ctx.fillStyle = "#54524C";
  ctx.font = `500 30px ${fonts.sans}, sans-serif`;
  wrapText(ctx, formatEventMeta(event.startsAt, event.location), 88, cursorY, W - 176, 40, 2);

  cursorY += 100;
  ctx.fillStyle = "#54524C";
  ctx.font = `400 28px ${fonts.sans}, sans-serif`;
  wrapText(ctx, event.description, 88, cursorY, W - 176, 40, 5);

  ctx.fillStyle = "#175A82";
  ctx.font = `700 28px ${fonts.serif}, serif`;
  ctx.fillText("Comunidad Cristiana · Sucre", 88, H - 88);

  ctx.fillStyle = "#2E8FC4";
  ctx.font = `500 22px ${fonts.mono}, monospace`;
  ctx.fillText(formatTime(event.startsAt), W - 88 - ctx.measureText(formatTime(event.startsAt)).width, H - 88);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo exportar la tarjeta"));
    }, "image/png");
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen del evento"));
    img.src = src;
  });
}

export function proxiedImageSrc(url: string): string {
  return `/api/image?src=${encodeURIComponent(url)}`;
}

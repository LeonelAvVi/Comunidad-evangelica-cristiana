"use client";

import { useEffect, useState } from "react";
import { eventPermalink, formatShareDate } from "@/lib/format";
import { loadImage, proxiedImageSrc, renderShareCard } from "@/lib/share-card";
import type { ChurchEvent } from "@/lib/types";
import { useToast } from "./Toast";

function canUseNativeShare() {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function getShareFiles(event: ChurchEvent): Promise<File[]> {
  if (!event.imageUrl) return [];
  try {
    const src = proxiedImageSrc(event.imageUrl);
    const res = await fetch(src);
    const blob = await res.blob();
    const file = new File([blob], `${event.id}-flyer.${blob.type.includes("png") ? "png" : "jpg"}`, {
      type: blob.type || "image/jpeg",
    });
    if (navigator.canShare?.({ files: [file] })) return [file];
  } catch {
    return [];
  }
  return [];
}

export function ShareButton({ event }: { event: ChurchEvent }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  async function onShare() {
    const url = eventPermalink(event.id);
    const text = `${event.description}\n${formatShareDate(event.startsAt, event.location)}`;
    const title = `${event.title} — Comunidad Cristiana`;

    if (canUseNativeShare()) {
      try {
        const files = await getShareFiles(event);
        const payload: ShareData = { title, text, url };
        if (files.length) payload.files = files;
        await navigator.share(payload);
        return;
      } catch (error) {
        if ((error as DOMException).name === "AbortError") return;
      }
    }
    setOpen(true);
  }

  return (
    <>
      <button type="button" className="share-btn" onClick={onShare}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 0 6 2.97 2.97 0 0 0 1.83-.63l-6.7 3.9a3 3 0 1 0 0 3.46l6.7 3.9A3 3 0 1 0 18 16a2.97 2.97 0 0 0-1.83.63l-6.7-3.9a3.1 3.1 0 0 0 0-1.46l6.7-3.9c.5.4 1.14.63 1.83.63Z" />
        </svg>
        Compartir
      </button>
      {open ? <ShareModal event={event} onClose={() => setOpen(false)} toast={toast} /> : null}
    </>
  );
}

function ShareModal({
  event,
  onClose,
  toast,
}: {
  event: ChurchEvent;
  onClose: () => void;
  toast: (message: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;

    async function run() {
      try {
        let flyer: HTMLImageElement | null = null;
        if (event.imageUrl) {
          try {
            flyer = await loadImage(proxiedImageSrc(event.imageUrl));
          } catch {
            flyer = null;
          }
        }
        const next = await renderShareCard(event, flyer);
        if (cancelled) return;
        const url = URL.createObjectURL(next);
        revoked = url;
        setBlob(next);
        setPreview(url);
      } catch {
        toast("No se pudo armar la tarjeta");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [event, toast]);

  async function copyLink() {
    await navigator.clipboard.writeText(eventPermalink(event.id));
    toast("Enlace copiado");
  }

  async function copyText() {
    const body = `${event.title}\n${event.description}\n${formatShareDate(event.startsAt, event.location)}\n${eventPermalink(event.id)}`;
    await navigator.clipboard.writeText(body);
    toast("Texto copiado — pegalo donde quieras compartirlo");
  }

  function download() {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}-tarjeta.png`;
    a.click();
    toast("Tarjeta descargada");
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-labelledby="share-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="share-title">Compartir evento</h3>
        <p className="hint">Descargá la tarjeta, copiá el enlace o el texto para mandarlo por WhatsApp u otra red.</p>
        <div className="share-preview">
          {preview ? (
            <img src={preview} alt={`Tarjeta de ${event.title}`} />
          ) : (
            <div className="detail-placeholder">{busy ? "Armando tarjeta…" : "Sin vista previa"}</div>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={download} disabled={!blob}>
            Descargar tarjeta
          </button>
          <button type="button" className="btn btn-ghost" onClick={copyLink}>
            Copiar enlace
          </button>
          <button type="button" className="btn btn-ghost" onClick={copyText}>
            Copiar texto
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

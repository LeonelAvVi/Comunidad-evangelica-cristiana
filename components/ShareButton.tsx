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

function shareMessage(event: ChurchEvent, url: string) {
  return [
    event.title,
    formatShareDate(event.startsAt, event.location),
    "",
    event.description,
    "",
    url,
  ].join("\n");
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
    const text = shareMessage(event, url);
    const title = `${event.title} — Comunidad Cristiana`;

    if (canUseNativeShare()) {
      try {
        // WhatsApp suele ignorar title/text si mandamos files; priorizamos el enlace con preview OG.
        const payload: ShareData = { title, text, url };
        await navigator.share(payload);
        return;
      } catch (error) {
        if ((error as DOMException).name === "AbortError") return;
      }

      // Fallback: compartir flyer si el share de texto falló por otro motivo.
      try {
        const files = await getShareFiles(event);
        if (files.length) {
          await navigator.share({ files, title, text });
          return;
        }
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

        // Forzar decodificación/pintado antes de mostrar (evita preview “vacía” hasta un click).
        const probe = new Image();
        probe.src = url;
        if (probe.decode) {
          try {
            await probe.decode();
          } catch {
            /* ignore */
          }
        } else {
          await new Promise<void>((resolve) => {
            probe.onload = () => resolve();
            probe.onerror = () => resolve();
          });
        }

        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

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
    const body = shareMessage(event, eventPermalink(event.id));
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
        <p className="hint">
          Lo más fácil para WhatsApp: copiá el enlace. También podés bajar la tarjeta o copiar el texto
          completo.
        </p>
        <div className="share-preview">
          {preview ? (
            <img src={preview} alt={`Tarjeta de ${event.title}`} width={1080} height={1350} />
          ) : (
            <div className="detail-placeholder">{busy ? "Armando tarjeta…" : "Sin vista previa"}</div>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary modal-action-main" onClick={copyLink}>
            Copiar enlace
          </button>
          <p className="modal-action-note">Ideal para WhatsApp: muestra título, fecha e imagen</p>
          <div className="modal-actions-secondary">
            <button type="button" className="btn btn-secondary" onClick={download} disabled={!blob}>
              Descargar
            </button>
            <button type="button" className="btn btn-secondary" onClick={copyText}>
              Copiar texto
            </button>
          </div>
          <button type="button" className="modal-dismiss" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

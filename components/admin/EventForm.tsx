"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { createEvent, MAX_IMAGE_BYTES, updateEvent, uploadEventImage } from "@/lib/events";
import { toDatetimeLocal } from "@/lib/format";
import { SECTOR_LIST } from "@/lib/sectors";
import type { ChurchEvent, EventInput, SectorId } from "@/lib/types";
import { useToast } from "@/components/Toast";

type Props = {
  event?: ChurchEvent;
};

export function EventForm({ event }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [sector, setSector] = useState<SectorId>(event?.sector ?? "jovenes");
  const [startsAt, setStartsAt] = useState(event ? toDatetimeLocal(event.startsAt) : "");
  const [imageUrl, setImageUrl] = useState<string | null>(event?.imageUrl ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(event?.imageUrl ?? null);

  useEffect(() => {
    if (!file) {
      setPreview(imageUrl);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, imageUrl]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (file && file.size > MAX_IMAGE_BYTES) {
        throw new Error("La imagen no puede superar 5 MB.");
      }
      if (file && !isCloudinaryConfigured()) {
        throw new Error(
          "Falta configurar Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).",
        );
      }
      const payload: EventInput = {
        title,
        description,
        location,
        sector,
        startsAt: new Date(startsAt).toISOString(),
        imageUrl,
      };
      let id = event?.id;
      if (!id) {
        id = await createEvent({ ...payload, imageUrl: null });
      }
      if (file) {
        payload.imageUrl = await uploadEventImage(file, id);
      }
      await updateEvent(id, payload);
      toast(event ? "Evento actualizado" : "Evento publicado");
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="title">Título</label>
        <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="startsAt">Fecha y hora</label>
        <input
          id="startsAt"
          type="datetime-local"
          required
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="location">Lugar</label>
        <input id="location" required value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="sector">Sector</label>
        <select id="sector" value={sector} onChange={(e) => setSector(e.target.value as SectorId)}>
          {SECTOR_LIST.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="flyer">Flyer / imagen</label>
        <input
          id="flyer"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const next = e.target.files?.[0] ?? null;
            setFile(next);
          }}
        />
        {preview ? <img src={preview} alt="Vista previa" style={{ marginTop: 10, maxWidth: 280, borderRadius: 12 }} /> : null}
        {imageUrl && !file ? (
          <button type="button" className="btn btn-ghost" onClick={() => setImageUrl(null)}>
            Quitar imagen
          </button>
        ) : null}
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Guardando…" : event ? "Guardar cambios" : "Publicar evento"}
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => router.push("/admin")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { ShareButton } from "@/components/ShareButton";
import { getEventById, upcomingEvents } from "@/lib/events";
import { useEvents } from "@/lib/events-context";
import { formatEventMeta, formatLongDate } from "@/lib/format";
import { SECTORS } from "@/lib/sectors";
import type { ChurchEvent } from "@/lib/types";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const { events, loading } = useEvents();
  const fromList = events.find((item) => item.id === params.id) ?? null;
  const [fetched, setFetched] = useState<ChurchEvent | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (fromList) {
      setMissing(false);
      return;
    }
    if (loading) return;
    let cancelled = false;
    void getEventById(params.id).then((found) => {
      if (cancelled) return;
      if (found) setFetched(found);
      else setMissing(true);
    });
    return () => {
      cancelled = true;
    };
  }, [fromList, loading, params.id]);

  const event = fromList ?? fetched;

  if (missing) {
    return (
      <section>
        <div className="wrap">
          <h1>Evento no encontrado</h1>
          <p className="lead" style={{ marginTop: 16 }}>
            Puede que ya haya pasado o que el enlace esté desactualizado.
          </p>
          <p style={{ marginTop: 24 }}>
            <Link href="/#eventos" className="btn btn-primary">
              Ver agenda
            </Link>
          </p>
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section>
        <div className="wrap">
          <p>Cargando evento…</p>
        </div>
      </section>
    );
  }

  const sector = SECTORS[event.sector];
  const related = upcomingEvents(events, event.sector)
    .filter((item) => item.id !== event.id)
    .slice(0, 3);

  return (
    <section>
      <div className="wrap">
        <p className="eyebrow" style={{ color: sector.color }}>
          {sector.name}
        </p>
        <h1 style={{ marginTop: 12, fontSize: "clamp(32px, 4vw, 48px)" }}>{event.title}</h1>
        <p style={{ marginTop: 12, color: "var(--ink-soft)" }}>
          {formatLongDate(event.startsAt)} · {formatEventMeta(event.startsAt, event.location)}
        </p>
        <div className="detail-layout" style={{ marginTop: 32 }}>
          <div className="detail-flyer">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={`Flyer de ${event.title}`} />
            ) : (
              <div className="detail-placeholder">Sin flyer cargado</div>
            )}
          </div>
          <div>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--ink-soft)" }}>{event.description}</p>
            <p style={{ marginTop: 18 }}>
              <Link href={`/sectores/${sector.slug}`} style={{ fontWeight: 600, color: sector.color }}>
                Ver más de {sector.name} →
              </Link>
            </p>
            <div style={{ marginTop: 24 }}>
              <ShareButton event={event} />
            </div>
          </div>
        </div>
        {related.length > 0 ? (
          <>
            <div className="sec-head">
              <span className="eyebrow">También</span>
              <h2>Otros eventos de {sector.name}</h2>
            </div>
            <div className="events-grid">
              {related.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

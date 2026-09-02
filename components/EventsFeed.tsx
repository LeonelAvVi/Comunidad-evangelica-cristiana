"use client";

import { useMemo, useState } from "react";
import { upcomingEvents } from "@/lib/events";
import { useEvents } from "@/lib/events-context";
import { SECTOR_LIST } from "@/lib/sectors";
import type { SectorId } from "@/lib/types";
import { EventCard } from "./EventCard";
import { Reveal } from "./Reveal";

export function EventsFeed({
  sector,
  heading = true,
}: {
  sector?: SectorId;
  heading?: boolean;
}) {
  const { events, loading, error, demoMode } = useEvents();
  const [filter, setFilter] = useState<"todos" | SectorId>(sector ?? "todos");

  const visible = useMemo(() => {
    const next = upcomingEvents(events, sector);
    if (sector || filter === "todos") return next;
    return next.filter((event) => event.sector === filter);
  }, [events, filter, sector]);

  return (
    <section id={sector ? undefined : "eventos"}>
      <div className="wrap">
        {heading ? (
          <Reveal className="sec-head">
            <span className="eyebrow">{sector ? "Agenda del sector" : "Agenda"}</span>
            <h2>Lo que se viene</h2>
            <p>
              {sector
                ? "Eventos propios de este sector, ordenados por fecha. Compartilos con quien quieras invitar."
                : "Todos los eventos de la comunidad, ordenados por fecha. Filtrá por sector o compartilos con quien quieras invitar."}
            </p>
          </Reveal>
        ) : null}
        {demoMode ? (
          <p className="banner">
            Estás viendo eventos de ejemplo. Cuando Firebase esté configurado, acá van a aparecer los
            eventos cargados desde el panel administrador.
          </p>
        ) : null}
        {!sector ? (
          <div className="feed-tabs">
            <button
              type="button"
              className={`tab${filter === "todos" ? " active" : ""}`}
              onClick={() => setFilter("todos")}
            >
              Todos
            </button>
            {SECTOR_LIST.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`tab${filter === item.id ? " active" : ""}`}
                onClick={() => setFilter(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        ) : null}
        {error ? <p className="error-text">{error}</p> : null}
        <div className="events-grid">
          {loading ? <p className="empty-state">Cargando eventos…</p> : null}
          {!loading && visible.length === 0 ? (
            <p className="empty-state">Todavía no hay eventos próximos en esta agenda.</p>
          ) : null}
          {visible.map((event) => (
            <Reveal key={event.id}>
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

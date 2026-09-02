"use client";

import { upcomingEvents } from "@/lib/events";
import { useEvents } from "@/lib/events-context";
import { formatDay, formatMonthShort, formatTime } from "@/lib/format";
import { SECTORS } from "@/lib/sectors";

export function TicketStack() {
  const { events } = useEvents();
  const next = upcomingEvents(events).slice(0, 3);
  const positions = ["t1", "t2", "t3"] as const;
  const ordered = [...next].reverse();

  if (ordered.length === 0) {
    return (
      <div className="stack" aria-hidden="true">
        <div className="ticket t1">
          <div className="stub" style={{ background: "var(--teal)" }}>
            <span className="d">—</span>
            <span className="m">Pronto</span>
          </div>
          <div className="body">
            <div className="sector">Agenda</div>
            <div className="title">Los próximos eventos van a aparecer acá</div>
            <div className="time">Cargalos desde el panel</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack" aria-hidden="true">
      {ordered.map((event, index) => {
        const sector = SECTORS[event.sector];
        const cls = positions[Math.min(index, 2)];
        return (
          <div className={`ticket ${cls}`} key={event.id}>
            <div className="stub" style={{ background: sector.color }}>
              <span className="d">{formatDay(event.startsAt)}</span>
              <span className="m">{formatMonthShort(event.startsAt)}</span>
            </div>
            <div className="body">
              <div className="sector">{sector.name}</div>
              <div className="title">{event.title}</div>
              <div className="time">
                {formatTime(event.startsAt)} · {event.location}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useEvents } from "@/lib/events-context";
import { removeEvent } from "@/lib/events";
import { formatEventMeta } from "@/lib/format";
import { SECTORS } from "@/lib/sectors";
import { useToast } from "@/components/Toast";

const DOW = ["L", "M", "M", "J", "V", "S", "D"];

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let d = 1; d <= days; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AdminHomePage() {
  const { events, loading } = useEvents();
  const toast = useToast();
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());
  const [view, setView] = useState<"lista" | "calendario">("lista");

  const counts = useMemo(() => {
    const map = new Map<number, number>();
    events.forEach((event) => {
      const date = new Date(event.startsAt);
      if (date.getFullYear() === cursor.year && date.getMonth() === cursor.month) {
        map.set(date.getDate(), (map.get(date.getDate()) ?? 0) + 1);
      }
    });
    return map;
  }, [events, cursor]);

  const filtered = useMemo(() => {
    if (view === "lista" || selectedDay == null) return events;
    return events.filter((event) => {
      const date = new Date(event.startsAt);
      return (
        date.getFullYear() === cursor.year &&
        date.getMonth() === cursor.month &&
        date.getDate() === selectedDay
      );
    });
  }, [events, view, selectedDay, cursor]);

  async function onDelete(id: string, title: string) {
    if (!window.confirm(`¿Eliminar “${title}”? Esta acción no se puede deshacer.`)) return;
    try {
      await removeEvent(id);
      toast("Evento eliminado");
    } catch {
      toast("No se pudo eliminar");
    }
  }

  const cells = monthMatrix(cursor.year, cursor.month);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("es-BO", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="admin-toolbar">
        <button
          type="button"
          className={`tab${view === "lista" ? " active" : ""}`}
          onClick={() => setView("lista")}
        >
          Lista
        </button>
        <button
          type="button"
          className={`tab${view === "calendario" ? " active" : ""}`}
          onClick={() => setView("calendario")}
        >
          Calendario
        </button>
      </div>

      {view === "calendario" ? (
        <>
          <div className="admin-head" style={{ marginBottom: 12 }}>
            <h2 style={{ textTransform: "capitalize" }}>{monthLabel}</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  setCursor((c) => {
                    const month = c.month - 1;
                    return month < 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month };
                  })
                }
              >
                Anterior
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  setCursor((c) => {
                    const month = c.month + 1;
                    return month > 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month };
                  })
                }
              >
                Siguiente
              </button>
            </div>
          </div>
          <div className="cal-grid">
            {DOW.map((d) => (
              <div key={d} className="cal-dow">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              if (day == null) return <div key={`e-${i}`} />;
              const count = counts.get(day) ?? 0;
              const active = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  className={`cal-cell${count ? " has" : ""}${active ? " active" : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <strong>{day}</strong>
                  {count ? <div className="cal-count">{count} evento{count > 1 ? "s" : ""}</div> : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {loading ? <p>Cargando…</p> : null}
      {!loading && filtered.length === 0 ? (
        <p className="empty-state">No hay eventos en esta vista. Creá el primero.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Flyer</th>
              <th>Evento</th>
              <th>Sector</th>
              <th>Cuándo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr key={event.id}>
                <td>
                  {event.imageUrl ? (
                    <img className="thumb" src={event.imageUrl} alt="" />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <strong>{event.title}</strong>
                  <div style={{ color: "var(--ink-soft)", fontSize: 13 }}>{event.location}</div>
                </td>
                <td>{SECTORS[event.sector].name}</td>
                <td>{formatEventMeta(event.startsAt, event.location)}</td>
                <td>
                  <div className="row-actions">
                    <Link href={`/admin/eventos/${event.id}`} className="btn btn-ghost">
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => onDelete(event.id, event.title)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

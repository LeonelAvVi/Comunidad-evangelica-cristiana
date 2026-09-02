"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EventForm } from "@/components/admin/EventForm";
import { getEventById } from "@/lib/events";
import { useEvents } from "@/lib/events-context";
import type { ChurchEvent } from "@/lib/types";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const { events } = useEvents();
  const [event, setEvent] = useState<ChurchEvent | null>(
    events.find((item) => item.id === params.id) ?? null,
  );
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const fromList = events.find((item) => item.id === params.id);
    if (fromList) {
      setEvent(fromList);
      return;
    }
    void getEventById(params.id).then((found) => {
      if (found) setEvent(found);
      else setMissing(true);
    });
  }, [events, params.id]);

  if (missing) return <p>No encontramos ese evento.</p>;
  if (!event) return <p>Cargando…</p>;

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>Editar evento</h2>
      <EventForm event={event} />
    </>
  );
}

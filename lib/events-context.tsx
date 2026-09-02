"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEMO_EVENTS } from "@/lib/demo-events";
import { subscribeEvents } from "@/lib/events";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { ChurchEvent } from "@/lib/types";

type EventsContextValue = {
  events: ChurchEvent[];
  loading: boolean;
  error: string | null;
  demoMode: boolean;
};

const demoMode = !isFirebaseConfigured();

const EventsContext = createContext<EventsContextValue>({
  events: demoMode ? DEMO_EVENTS : [],
  loading: !demoMode,
  error: null,
  demoMode,
});

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<ChurchEvent[]>(demoMode ? DEMO_EVENTS : []);
  const [loading, setLoading] = useState(!demoMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeEvents(
      (next) => {
        setEvents(next);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  const value = useMemo(
    () => ({ events, loading, error, demoMode }),
    [events, loading, error],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  return useContext(EventsContext);
}

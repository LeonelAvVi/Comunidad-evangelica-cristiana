"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext<(message: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const show = useCallback((next: string) => {
    setMessage(next);
    setOpen(true);
    window.setTimeout(() => setOpen(false), 2400);
  }, []);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={`toast${open ? " show" : ""}`} role="status">
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

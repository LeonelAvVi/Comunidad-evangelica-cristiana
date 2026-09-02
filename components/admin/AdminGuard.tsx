"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!configured);

  useEffect(() => {
    if (!configured) {
      setReady(true);
      return;
    }
    const unsub = onAuthStateChanged(getFirebaseAuth(), (next) => {
      setUser(next);
      setReady(true);
      if (!next && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
      if (next && pathname === "/admin/login") {
        router.replace("/admin");
      }
    });
    return unsub;
  }, [configured, pathname, router]);

  if (!ready) {
    return (
      <div className="admin-shell">
        <div className="wrap">
          <p>Cargando panel…</p>
        </div>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="admin-shell">
        <div className="wrap">
          <h1>Falta configurar Firebase</h1>
          <p className="lead" style={{ marginTop: 16, maxWidth: "52ch" }}>
            El panel administrador usa Firebase Authentication, Firestore y Storage. Copiá{" "}
            <code>.env.example</code> a <code>.env.local</code>, pegá las claves del proyecto y
            recargá.
          </p>
          <ol style={{ lineHeight: 1.7, color: "var(--ink-soft)", paddingLeft: 18 }}>
            <li>Creá un proyecto en Firebase y habilitá Email/Password, Firestore y Storage.</li>
            <li>Desplegá las reglas de <code>firestore.rules</code> y <code>storage.rules</code>.</li>
            <li>Creá el usuario administrador en Authentication.</li>
            <li>En Vercel, cargá las mismas variables de entorno y volvé a desplegar.</li>
          </ol>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="admin-shell">
      <div className="wrap">
        <div className="admin-head">
          <div>
            <span className="eyebrow">Administración</span>
            <h1 style={{ marginTop: 8 }}>Eventos de la comunidad</h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{user.email}</span>
            <Link href="/admin/eventos/nuevo" className="btn btn-primary">
              Nuevo evento
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => signOut(getFirebaseAuth())}>
              Salir
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

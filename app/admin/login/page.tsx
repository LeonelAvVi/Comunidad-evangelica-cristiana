"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isFirebaseConfigured()) return;
    setBusy(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
      router.replace("/admin");
    } catch {
      setError("No pudimos entrar. Revisá el correo y la contraseña.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-card">
      <span className="eyebrow">Panel</span>
      <h1 style={{ marginTop: 10 }}>Entrar</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 10, marginBottom: 24 }}>
        Solo para quienes cargan la agenda de la iglesia.
      </p>
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

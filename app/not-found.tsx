import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <section>
      <div className="wrap">
        <span className="eyebrow">404</span>
        <h1 style={{ marginTop: 12 }}>Esta página no está</h1>
        <p className="lead" style={{ marginTop: 16 }}>
          Volvé al inicio para ver los sectores y la agenda de la comunidad.
        </p>
        <p style={{ marginTop: 24 }}>
          <Link href="/" className="btn btn-primary">
            Ir al inicio
          </Link>
        </p>
      </div>
    </section>
  );
}

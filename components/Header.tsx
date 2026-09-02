"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "./BrandMark";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <header className="site">
        <nav className="wrap">
          <Link href="/" className="brand">
            <BrandMark />
            Comunidad Cristiana
          </Link>
          <Link href="/admin" className="navcta">
            Panel
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <header className="site">
      <nav className="wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <BrandMark />
          Comunidad Cristiana
        </Link>
        <ul className={`navlinks${open ? " open" : ""}`}>
          <li>
            <Link href="/#sectores" onClick={() => setOpen(false)}>
              Sectores
            </Link>
          </li>
          <li>
            <Link href="/#eventos" onClick={() => setOpen(false)}>
              Eventos
            </Link>
          </li>
          <li>
            <Link href="/#visita" onClick={() => setOpen(false)}>
              Horarios
            </Link>
          </li>
        </ul>
        <Link href="/#eventos" className="navcta">
          Ver eventos
        </Link>
        <button
          className="navtoggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}

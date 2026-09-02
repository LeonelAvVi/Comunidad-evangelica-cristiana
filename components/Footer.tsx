"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { SECTOR_LIST } from "@/lib/sectors";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href="/" className="brand">
              <BrandMark />
              Comunidad Cristiana
            </Link>
            <p>Sucre, Bolivia. Un solo lugar para todos los sectores y todos los eventos de la semana.</p>
          </div>
          <div className="foot-col">
            <h5>Sectores</h5>
            <ul>
              {SECTOR_LIST.map((sector) => (
                <li key={sector.id}>
                  <Link href={`/sectores/${sector.slug}`}>{sector.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h5>Comunidad</h5>
            <ul>
              <li>
                <Link href="/#eventos">Eventos</Link>
              </li>
              <li>
                <Link href="/#visita">Horarios</Link>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/search/Comunidad+Cristiana+Sucre"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cómo llegar
                </a>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Seguinos</h5>
            <ul>
              <li>
                <a href="https://www.facebook.com/ComunidadCristianaSucre" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@ComunidadLIVE" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@comunidadjuvenil.cce" target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Comunidad Cristiana — Sucre</span>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

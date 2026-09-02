import Link from "next/link";
import { SECTOR_LIST } from "@/lib/sectors";
import { Reveal } from "./Reveal";

export function SectorsGrid() {
  return (
    <section id="sectores">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Sectores</span>
          <h2>Cada edad, su propio espacio</h2>
          <p>Misma comunidad, distinta manera de vivirla. Entrá al sector que te toca para ver sus eventos y redes.</p>
        </Reveal>
        <div className="sectors-grid">
          {SECTOR_LIST.map((sector) => (
            <Reveal key={sector.id}>
              <Link href={`/sectores/${sector.slug}`} className="sector-card">
                <span className="bar" style={{ background: sector.color }} />
                <div className="glyph" style={{ background: sector.color }}>
                  {sector.glyph}
                </div>
                <h3>{sector.name}</h3>
                <p>{sector.tagline}</p>
                <span className="go" style={{ color: sector.color }}>
                  Ver sector →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

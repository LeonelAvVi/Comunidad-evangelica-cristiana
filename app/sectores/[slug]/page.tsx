import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventsFeed } from "@/components/EventsFeed";
import { isSectorId, SECTORS } from "@/lib/sectors";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(SECTORS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isSectorId(slug)) return {};
  const sector = SECTORS[slug];
  return {
    title: sector.name,
    description: sector.description,
  };
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  if (!isSectorId(slug)) notFound();
  const sector = SECTORS[slug];

  return (
    <div style={{ ["--accent" as string]: sector.color }}>
      <section className="sector-hero">
        <div className="wrap">
          <div className="sector-hero-card">
            <div className="bar" />
            <div className="sector-hero-inner">
              <div>
                <span className="eyebrow" style={{ color: sector.color }}>
                  Sector
                </span>
                <h1 style={{ marginTop: 14, fontSize: "clamp(34px, 5vw, 52px)" }}>{sector.name}</h1>
                <p className="lead" style={{ marginTop: 16, maxWidth: "52ch", color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  {sector.description}
                </p>
                <p style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-soft)" }}>
                  {sector.meeting}
                </p>
                {sector.socials.length > 0 ? (
                  <div className="social-row">
                    {sector.socials.map((social) => (
                      <a
                        key={social.href}
                        className="social-pill"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="glyph">{sector.glyph}</div>
            </div>
          </div>
        </div>
      </section>
      <EventsFeed sector={sector.id} />
    </div>
  );
}

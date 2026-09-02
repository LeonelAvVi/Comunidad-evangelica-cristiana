import type { SectorId } from "./types";

export type SocialLink = {
  label: string;
  href: string;
};

export type SectorTheme = {
  id: SectorId;
  slug: SectorId;
  name: string;
  glyph: string;
  color: string;
  tagline: string;
  description: string;
  meeting: string;
  socials: SocialLink[];
};

export const SECTORS: Record<SectorId, SectorTheme> = {
  ninos: {
    id: "ninos",
    slug: "ninos",
    name: "Niños",
    glyph: "N",
    color: "#EFB22B",
    tagline: "Juegos, canciones y primeras historias de fe",
    description:
      "Un espacio pensado para los más pequeños: juegos, manualidades, canciones y las primeras historias de fe, con líderes que los acompañan cada semana.",
    meeting: "Domingos · junto al culto general",
    socials: [],
  },
  adolescentes: {
    id: "adolescentes",
    slug: "adolescentes",
    name: "Adolescentes",
    glyph: "A",
    color: "#D8433B",
    tagline: "Preguntas de esta etapa, entre pares",
    description:
      "Un espacio propio para las preguntas de esta etapa: identidad, amistad y fe, entre pares y con acompañamiento pastoral.",
    meeting: "Encuentros semanales en el salón de jóvenes",
    socials: [],
  },
  jovenes: {
    id: "jovenes",
    slug: "jovenes",
    name: "Jóvenes",
    glyph: "J",
    color: "#3C9146",
    tagline: "Comunidad Juvenil: alabanza, salidas y contenido en vivo",
    description:
      "Comunidad Juvenil se reúne para alabar, compartir la semana y salir juntos. Si no podés venir, también hay transmisión en vivo.",
    meeting: "Sábados 19:00 · Comunidad Juvenil",
    socials: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/ComunidadCristianaSucre",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@ComunidadLIVE",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@comunidadjuvenil.cce",
      },
    ],
  },
  matrimonios: {
    id: "matrimonios",
    slug: "matrimonios",
    name: "Matrimonios",
    glyph: "M",
    color: "#C98A5C",
    tagline: "Encuentros para fortalecer la pareja",
    description:
      "Encuentros, cenas y talleres para las parejas de la comunidad, en cada etapa del camino.",
    meeting: "Encuentros periódicos en el salón principal",
    socials: [],
  },
};

export const SECTOR_LIST = Object.values(SECTORS);

export function isSectorId(value: string): value is SectorId {
  return value in SECTORS;
}

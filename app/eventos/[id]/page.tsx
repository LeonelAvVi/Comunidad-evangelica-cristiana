import type { Metadata } from "next";
import { EventDetailClient } from "./EventDetailClient";
import { getEventByIdServer, siteOrigin } from "@/lib/events-server";
import { formatEventMeta, formatLongDate } from "@/lib/format";
import { SECTORS } from "@/lib/sectors";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventByIdServer(id);
  const origin = siteOrigin();

  if (!event) {
    return {
      title: "Evento",
      description: "Evento de Comunidad Cristiana — Sucre",
    };
  }

  const sector = SECTORS[event.sector];
  const when = formatLongDate(event.startsAt);
  const meta = formatEventMeta(event.startsAt, event.location);
  const description = `${when} · ${meta}. ${event.description}`.slice(0, 200);
  const title = `${event.title} · ${sector.name}`;
  const url = `${origin}/eventos/${event.id}`;

  return {
    title: event.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Comunidad Cristiana",
      locale: "es_BO",
      images: event.imageUrl
        ? [
            {
              url: event.imageUrl,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ]
        : [
            {
              url: `${origin}/logo-comunidad-cristiana.jpg`,
              width: 512,
              height: 512,
              alt: "Comunidad Cristiana",
            },
          ],
    },
    twitter: {
      card: event.imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: event.imageUrl ? [event.imageUrl] : [`${origin}/logo-comunidad-cristiana.jpg`],
    },
  };
}

export default function EventDetailPage() {
  return <EventDetailClient />;
}

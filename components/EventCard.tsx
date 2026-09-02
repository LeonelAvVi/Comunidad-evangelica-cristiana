import Link from "next/link";
import { SECTORS } from "@/lib/sectors";
import { formatDay, formatEventMeta, formatMonthShort } from "@/lib/format";
import type { ChurchEvent } from "@/lib/types";
import { ShareButton } from "./ShareButton";

export function EventCard({ event }: { event: ChurchEvent }) {
  const sector = SECTORS[event.sector];

  return (
    <article className="event-card">
      {event.imageUrl ? (
        <Link href={`/eventos/${event.id}`} className="event-flyer">
          <img src={event.imageUrl} alt="" />
        </Link>
      ) : null}
      <div className="event-top">
        <span className="event-tag" style={{ color: sector.color }}>
          {sector.name}
        </span>
        <div className="datebadge" style={{ background: sector.color }}>
          <span className="d">{formatDay(event.startsAt)}</span>
          <span className="m">{formatMonthShort(event.startsAt)}</span>
        </div>
      </div>
      <div className="event-body">
        <h4>
          <Link href={`/eventos/${event.id}`}>{event.title}</Link>
        </h4>
        <div className="meta">{formatEventMeta(event.startsAt, event.location)}</div>
        <p className="desc">{event.description}</p>
        <div className="event-actions">
          <ShareButton event={event} />
        </div>
      </div>
    </article>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import { getEvents } from "@/lib/firestore";
import type { EventDoc } from "@/types/admin";

export function EventsSection() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data.filter((e) => e.active)))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && events.length === 0) return null;

  return (
    <section id="events" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary">EVENT</p>
          <h2 className="mb-1 text-3xl font-bold text-foreground md:text-4xl">イベント・出店情報</h2>
          <p className="mb-4 text-sm tracking-wide text-muted-foreground">Events &amp; Pop-up</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <p className="font-semibold text-foreground">{event.title}</p>
                <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays size={14} className="mt-0.5 shrink-0 text-primary/60" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-primary/60" />
                  <span>{event.location}</span>
                </div>
                {event.address && (
                  <p className="text-xs text-muted-foreground pl-5">{event.address}</p>
                )}
                {event.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{event.description}</p>
                )}
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-70"
                  >
                    詳細を見る
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

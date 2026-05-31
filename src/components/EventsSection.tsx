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
    <section id="events" className="overflow-hidden">

      {/* クリーム色の区切り — 前セクションとの分離 */}
      <div className="h-16 md:h-24" style={{ background: "var(--pop-cream)" }} />

      {/* 不動岩が背景 → タイトルが上に */}
      <div className="relative h-44 overflow-hidden md:h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/不動岩.svg" alt=""
          className="absolute inset-0 h-full w-full" style={{ objectFit: "cover", objectPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "rgba(20,40,25,0.78)" }} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1 text-white">
          <p className="text-xs font-bold tracking-[0.35em] text-white/60">✦ EVENT ✦</p>
          <h2 className="text-3xl font-black drop-shadow md:text-5xl">イベント・出店情報</h2>
        </div>
      </div>

      {/* イベントカード */}
      <div className="px-6 py-14" style={{ background: "var(--pop-cream)" }}>
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event.id}
                  className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
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
                    <p className="pl-5 text-xs text-muted-foreground">{event.address}</p>
                  )}
                  {event.description && (
                    <p className="whitespace-pre-line text-sm text-muted-foreground">{event.description}</p>
                  )}
                  {event.url && (
                    <a href={event.url} target="_blank" rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-70">
                      詳細を見る <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

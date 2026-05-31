"use client";

import { useEffect, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { getStores } from "@/lib/firestore";
import type { StoreDoc } from "@/types/admin";

export function StoresSection() {
  const [stores, setStores] = useState<StoreDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores()
      .then((data) => setStores(data.filter((s) => s.active)))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && stores.length === 0) return null;

  return (
    <section id="stores" className="overflow-hidden">

      {/* クリーム区切り */}
      <div className="h-16 md:h-24" style={{ background: "var(--pop-cream)" }} />

      {/* 猿田彦が背景 → タイトルが上に */}
      <div className="relative h-44 overflow-hidden md:h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/猿田彦.svg" alt=""
          className="absolute inset-0 h-full w-full" style={{ objectFit: "cover", objectPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "rgba(8,8,10,0.82)" }} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1 text-white">
          <p className="text-xs font-bold tracking-[0.35em] text-white/50">✦ WHERE TO BUY ✦</p>
          <h2 className="text-3xl font-black drop-shadow md:text-5xl">取扱店舗</h2>
        </div>
      </div>

      {/* 店舗カード */}
      <div className="px-6 py-14" style={{ background: "var(--pop-cream)" }}>
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <div key={store.id}
                  className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground">{store.name}</p>
                    {store.url && (
                      <a href={store.url} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                        aria-label="店舗サイトを開く">
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-primary/60" />
                    <span>{store.address}</span>
                  </div>
                  {store.note && <p className="text-xs text-muted-foreground">{store.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

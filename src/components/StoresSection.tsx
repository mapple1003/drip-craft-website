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
    <section id="stores" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary">WHERE TO BUY</p>
          <h2 className="mb-1 text-3xl font-bold text-foreground md:text-4xl">取扱店舗</h2>
          <p className="mb-4 text-sm tracking-wide text-muted-foreground">Where to Buy</p>
          <p className="text-muted-foreground">EKIREIのコーヒーをお取り扱いいただいている店舗です。</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{store.name}</p>
                  {store.url && (
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                      aria-label="店舗サイトを開く"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
                <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-primary/60" />
                  <span>{store.address}</span>
                </div>
                {store.note && (
                  <p className="text-xs text-muted-foreground">{store.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

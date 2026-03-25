"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSpots } from "@/lib/firestore";
import { getCollection } from "@/lib/collection";
import type { SpotDoc } from "@/types/admin";
import type { SpotStatus } from "@/lib/collection";
import { SpotMap } from "@/components/SpotMap";
import { BookOpen, Trophy, MapPin } from "lucide-react";

type SpotWithStatus = SpotDoc & { status: SpotStatus };

export default function CollectionPage() {
  const [spots, setSpots] = useState<SpotWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpots().then((allSpots) => {
      const collection = getCollection();
      const active = allSpots
        .filter((s) => s.active)
        .map((s) => ({
          ...s,
          status: collection.spots[s.id] ?? { scanned: false, visited: false },
        }));
      setSpots(active);
      setLoading(false);
    });
  }, []);

  const scannedCount = spots.filter((s) => s.status.scanned).length;
  const visitedCount = spots.filter((s) => s.status.visited).length;
  const total = spots.length;

  // Spots with coordinates for the map
  const mapSpots = spots
    .filter((s) => s.lat && s.lng)
    .map((s) => ({
      id: s.id,
      name: s.name,
      lat: s.lat!,
      lng: s.lng!,
      scanned: s.status.scanned,
      visited: s.status.visited,
    }));

  // Default map center: Yamaga area
  const mapCenter = mapSpots.length > 0
    ? { lat: mapSpots[0].lat, lng: mapSpots[0].lng }
    : { lat: 32.9942, lng: 130.6877 };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-widest text-primary">
            EKIREI
          </Link>
          <span className="text-xs text-muted-foreground">名所コレクション</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-primary">
            <BookOpen size={14} />
            <span className="font-medium tracking-wide">MY COLLECTION</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">山鹿名所スタンプ帳</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ドリップバッグのQRコードを読み込んで名所を集めよう
          </p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-8 grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4 text-center"
              style={{ background: "oklch(0.60 0.09 290 / 0.10)", border: "1px solid oklch(0.60 0.09 290 / 0.25)" }}
            >
              <div className="mb-1 text-3xl font-bold" style={{ color: "#693c85" }}>
                {scannedCount}
                <span className="text-base font-normal text-muted-foreground"> / {total}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium" style={{ color: "#693c85" }}>
                <span>🎫</span> コレクター
              </div>
            </div>
            <div
              className="rounded-2xl p-4 text-center"
              style={{ background: "oklch(0.60 0.09 162 / 0.10)", border: "1px solid oklch(0.60 0.09 162 / 0.25)" }}
            >
              <div className="mb-1 text-3xl font-bold" style={{ color: "#539d84" }}>
                {visitedCount}
                <span className="text-base font-normal text-muted-foreground"> / {total}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium" style={{ color: "#539d84" }}>
                <span>🗺️</span> 探訪者
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {!loading && total > 0 && (
          <div className="mb-8 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>🎫 コレクト進捗</span>
              <span>{Math.round((scannedCount / total) * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(scannedCount / total) * 100}%`, background: "#693c85" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>🗺️ 訪問進捗</span>
              <span>{Math.round((visitedCount / total) * 100)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(visitedCount / total) * 100}%`, background: "#539d84" }}
              />
            </div>
          </div>
        )}

        {/* Map */}
        {!loading && mapSpots.length > 0 && (
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin size={14} className="text-primary" />
              名所マップ
            </div>
            <div
              className="overflow-hidden rounded-2xl border border-border shadow-sm"
              style={{ height: 280 }}
            >
              <SpotMap
                lat={mapCenter.lat}
                lng={mapCenter.lng}
                name="山鹿"
                spots={mapSpots}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#539d84", border: "1.5px solid white" }} />
                訪問済み
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#693c85", border: "1.5px solid white" }} />
                コレクト済み
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#94a3b8", border: "1.5px solid white" }} />
                未入手
              </span>
            </div>
          </div>
        )}

        {/* Stamp grid */}
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <Trophy size={14} className="text-primary" />
          スタンプ一覧
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : spots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            名所がまだ登録されていません
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {spots.map((spot) => {
              const { scanned, visited } = spot.status;
              return (
                <Link
                  key={spot.id}
                  href={`/spots/${spot.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full overflow-hidden">
                    {spot.imageUrl || spot.images?.[0]?.url ? (
                      <Image
                        src={spot.imageUrl || spot.images![0].url}
                        alt={spot.name}
                        fill
                        className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                          !scanned ? "grayscale opacity-50" : ""
                        }`}
                        sizes="(max-width: 640px) 45vw, 240px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <MapPin size={32} className="text-muted-foreground/40" />
                      </div>
                    )}

                    {/* Unscanned overlay */}
                    {!scanned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white">
                          ？ 未入手
                        </div>
                      </div>
                    )}

                    {/* Trophy badges */}
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs font-bold transition-all ${
                          scanned ? "bg-[#693c85] text-white" : "bg-black/30 text-white/50"
                        }`}
                      >
                        🎫
                      </span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs font-bold transition-all ${
                          visited ? "bg-[#539d84] text-white" : "bg-black/30 text-white/50"
                        }`}
                      >
                        🗺️
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="p-3">
                    <p className={`text-sm font-semibold leading-tight ${scanned ? "text-foreground" : "text-muted-foreground"}`}>
                      {scanned ? spot.name : "？？？"}
                    </p>
                    {scanned && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {visited ? "✅ 訪問済み" : "📍 未訪問"}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* All collected message */}
        {!loading && total > 0 && scannedCount === total && visitedCount === total && (
          <div className="mt-8 rounded-2xl p-6 text-center" style={{ background: "oklch(0.60 0.09 162 / 0.10)" }}>
            <div className="mb-2 text-4xl">🏆</div>
            <p className="font-bold text-foreground">全制覇おめでとうございます！</p>
            <p className="mt-1 text-sm text-muted-foreground">すべての名所を収集・訪問しました</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-primary underline underline-offset-4 hover:text-primary/80">
            EKIREIのコーヒーをもっと見る
          </Link>
        </div>
      </main>
    </div>
  );
}

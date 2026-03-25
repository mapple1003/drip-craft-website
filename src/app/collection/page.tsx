"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getSpots } from "@/lib/firestore";
import { getCollection } from "@/lib/collection";
import type { SpotDoc } from "@/types/admin";
import type { SpotStatus } from "@/lib/collection";
import { SpotMap } from "@/components/SpotMap";
import { BookOpen, Trophy, MapPin, Share2, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type SpotWithStatus = SpotDoc & { status: SpotStatus };

const SHARE_ORIGIN = "https://www.ekirei219.com";

function encodeShare(spots: SpotWithStatus[]): string {
  const data = {
    s: spots.filter((s) => s.status.scanned).map((s) => s.id),
    v: spots.filter((s) => s.status.visited).map((s) => s.id),
  };
  return btoa(JSON.stringify(data));
}

function decodeShare(encoded: string): { scanned: Set<string>; visited: Set<string> } {
  try {
    const data = JSON.parse(atob(encoded)) as { s?: string[]; v?: string[] };
    return {
      scanned: new Set(data.s ?? []),
      visited: new Set(data.v ?? []),
    };
  } catch {
    return { scanned: new Set(), visited: new Set() };
  }
}

export default function CollectionPage() {
  return (
    <Suspense>
      <CollectionContent />
    </Suspense>
  );
}

function CollectionContent() {
  const searchParams = useSearchParams();
  const sharedParam = searchParams.get("shared");
  const isSharedView = !!sharedParam;

  const [spots, setSpots] = useState<SpotWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getSpots().then((allSpots) => {
      const active = allSpots.filter((s) => s.active);

      if (isSharedView && sharedParam) {
        // Shared view: decode URL data
        const { scanned, visited } = decodeShare(sharedParam);
        setSpots(
          active.map((s) => ({
            ...s,
            status: {
              scanned: scanned.has(s.id),
              visited: visited.has(s.id),
            },
          }))
        );
      } else {
        // Own collection: load from localStorage
        const collection = getCollection();
        setSpots(
          active.map((s) => ({
            ...s,
            status: collection.spots[s.id] ?? { scanned: false, visited: false },
          }))
        );
      }
      setLoading(false);
    });
  }, [isSharedView, sharedParam]);

  const handleShare = useCallback(() => {
    const encoded = encodeShare(spots);
    const url = `${SHARE_ORIGIN}/collection?shared=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("シェアURLをコピーしました！友達に送ってみよう 🎉");
      setTimeout(() => setCopied(false), 3000);
    });
  }, [spots]);

  const scannedCount = spots.filter((s) => s.status.scanned).length;
  const visitedCount = spots.filter((s) => s.status.visited).length;
  const total = spots.length;

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

  const mapCenter =
    mapSpots.length > 0
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

        {/* Shared view banner */}
        {isSharedView && (
          <div
            className="mb-6 flex items-start gap-3 rounded-2xl p-4 text-sm"
            style={{ background: "oklch(0.60 0.09 162 / 0.10)", border: "1px solid oklch(0.60 0.09 162 / 0.25)" }}
          >
            <ExternalLink size={16} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">シェアされたコレクション</p>
              <p className="mt-0.5 text-muted-foreground">
                誰かがコレクションをシェアしました。あなたも始めてみませんか？
              </p>
              <Link
                href="/collection"
                className="mt-2 inline-block font-medium text-primary underline underline-offset-4"
              >
                自分のコレクションを見る →
              </Link>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-primary">
            <BookOpen size={14} />
            <span className="font-medium tracking-wide">
              {isSharedView ? "SHARED COLLECTION" : "MY COLLECTION"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">山鹿名所スタンプ帳</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSharedView
              ? "友達のコレクションです"
              : "ドリップバッグのQRコードを読み込んで名所を集めよう"}
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

        {/* Progress bars */}
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

        {/* Share button — own collection only */}
        {!loading && !isSharedView && scannedCount > 0 && (
          <button
            onClick={handleShare}
            className="mb-8 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: copied ? "#539d84" : "#693c85" }}
          >
            {copied ? (
              <><Check size={16} />URLをコピーしました！</>
            ) : (
              <><Share2 size={16} />コレクションをシェアする</>
            )}
          </button>
        )}

        {/* Map */}
        {!loading && mapSpots.length > 0 && (
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin size={14} className="text-primary" />
              名所マップ
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm" style={{ height: 280 }}>
              <SpotMap lat={mapCenter.lat} lng={mapCenter.lng} name="山鹿" spots={mapSpots} />
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
              const card = (
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-square w-full overflow-hidden">
                    {spot.imageUrl || spot.images?.[0]?.url ? (
                      <Image
                        src={spot.imageUrl || spot.images![0].url}
                        alt={spot.name}
                        fill
                        className={`object-cover transition-all duration-300 group-hover:scale-105 ${!scanned ? "grayscale opacity-50" : ""}`}
                        sizes="(max-width: 640px) 45vw, 240px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <MapPin size={32} className="text-muted-foreground/40" />
                      </div>
                    )}
                    {!scanned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white">
                          ？ 未入手
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${scanned ? "bg-[#693c85] text-white" : "bg-black/30 text-white/50"}`}>🎫</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${visited ? "bg-[#539d84] text-white" : "bg-black/30 text-white/50"}`}>🗺️</span>
                    </div>
                  </div>
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
                </div>
              );

              // In shared view, cards are not clickable (no spoilers for uncollected spots)
              return isSharedView ? (
                <div key={spot.id}>{card}</div>
              ) : (
                <Link key={spot.id} href={`/spots/${spot.id}`}>{card}</Link>
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

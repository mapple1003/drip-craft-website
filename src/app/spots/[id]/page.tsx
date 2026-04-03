"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Navigation, CheckCircle2, Loader2, BookOpen, Volume2, Square } from "lucide-react";
import { getSpot } from "@/lib/firestore";
import { markScanned, markLocationVisited, getSpotStatus, distanceMeters } from "@/lib/collection";
import { incrementScanCount, incrementVisitCount } from "@/lib/stats";
import { useAudioGuide } from "@/hooks/useAudioGuide";
import type { SpotDoc, SpotLocation } from "@/types/admin";
import { SpotMap } from "@/components/SpotMap";
import { TrophyOverlay } from "@/components/TrophyOverlay";

type Lang = "ja" | "en" | "zh" | "ko";
type TrophyType = "collector" | "explorer";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
];

const GPS_THRESHOLD_METERS = 300;

function getContent(spot: SpotDoc, lang: Lang) {
  switch (lang) {
    case "en":
      return { name: spot.nameEn || spot.name, description: spot.descriptionEn || spot.description };
    case "zh":
      return { name: spot.nameZh || spot.name, description: spot.descriptionZh || spot.description };
    case "ko":
      return { name: spot.nameKo || spot.name, description: spot.descriptionKo || spot.description };
    default:
      return { name: spot.name, description: spot.description };
  }
}

export default function SpotPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [spot, setSpot] = useState<SpotDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>((searchParams.get("lang") as Lang) ?? "ja");

  // Collection state
  const [isScanned, setIsScanned] = useState(false);
  const [visitedLocations, setVisitedLocations] = useState<number[]>([]);
  const [trophyType, setTrophyType] = useState<TrophyType | null>(null);
  // null = still determining, true = locked (not scanned), false = unlocked
  const [locked, setLocked] = useState<boolean | null>(null);

  // Audio guide
  const { state: audioState, speak, stop: stopAudio } = useAudioGuide(lang);

  // GPS check-in state (per location index)
  const [gpsLoading, setGpsLoading] = useState<number | null>(null); // locationIndex or null
  const [gpsErrors, setGpsErrors] = useState<Record<number, string>>({});

  // On mount: determine lock status and handle QR scan trophy
  // Detection strategy:
  //   1. ?scan=1 in URL → explicit QR scan signal (new bags)
  //   2. No referrer / external referrer → QR scanner or direct URL (old bags without ?scan=1)
  //   3. Referrer is our own site → internal navigation (collection, etc.) → respect lock
  // NOTE: Use window.location.search (not useSearchParams) to avoid stale params
  // when navigating between /spots/[id] routes — Next.js reuses the component.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasQrParam = urlParams.get("scan") === "1";
    // External visit = no referrer, or referrer from a different domain (QR scanner app)
    const isExternalVisit =
      !document.referrer ||
      !document.referrer.includes(window.location.hostname);
    const isQrScan = hasQrParam || isExternalVisit;

    const status = getSpotStatus(id);
    setIsScanned(status.scanned);
    setVisitedLocations(status.visitedLocations ?? []);

    if (status.scanned) {
      // Already unlocked from a previous QR scan — always accessible
      setLocked(false);
    } else if (isQrScan) {
      // First-time QR scan: unlock and award collector trophy
      const { isNew } = markScanned(id);
      if (isNew) {
        setTimeout(() => setTrophyType("collector"), 600);
        setIsScanned(true);
        // Record scan in Firestore (fire-and-forget)
        incrementScanCount(id).catch(() => {});
      }
      setLocked(false);
    } else {
      // Internal navigation to unscanned spot — page is locked
      setLocked(true);
    }
  }, [id]);

  useEffect(() => {
    getSpot(id)
      .then((data) => {
        if (!data || !data.active) router.replace("/");
        else setSpot(data);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const switchLang = (code: Lang) => {
    setLang(code);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", code);
    router.replace(`/spots/${id}?${params.toString()}`, { scroll: false });
  };

  // Normalize locations: prefer spot.locations, fall back to legacy lat/lng
  const spotLocations: SpotLocation[] = spot
    ? (spot.locations?.length
        ? spot.locations
        : spot.lat && spot.lng
        ? [{ name: "", lat: spot.lat, lng: spot.lng }]
        : [])
    : [];

  const totalLocations = spotLocations.length;

  const handleGpsCheckin = useCallback((locationIndex: number, loc: SpotLocation) => {
    setGpsLoading(locationIndex);
    setGpsErrors((prev) => ({ ...prev, [locationIndex]: "" }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = distanceMeters(pos.coords.latitude, pos.coords.longitude, loc.lat, loc.lng);
        if (dist <= GPS_THRESHOLD_METERS) {
          const { isNewLocation, allVisited } = markLocationVisited(id, locationIndex, totalLocations, "gps");
          if (isNewLocation) {
            setVisitedLocations((prev) => [...prev, locationIndex]);
            if (allVisited) {
              setTrophyType("explorer");
              incrementVisitCount(id).catch(() => {});
            }
          }
        } else {
          setGpsErrors((prev) => ({
            ...prev,
            [locationIndex]: `現在地から約${Math.round(dist)}m離れています。現地（${GPS_THRESHOLD_METERS}m以内）でチェックインしてください。`,
          }));
        }
        setGpsLoading(null);
      },
      (err) => {
        const msg =
          err.code === 1
            ? "位置情報の許可が必要です。\n\n【iPhone Chrome】設定 → Chrome → 位置情報 → 「このAppの使用中のみ許可」\n【iPhone Safari】設定 → プライバシーとセキュリティ → 位置情報サービス → Safari\n【Android】ブラウザのアドレスバー横の🔒 → 位置情報 → 許可\n\nPlease allow location access in Settings → Chrome → Location."
            : err.code === 2
            ? "位置情報を取得できませんでした。屋外に出て再試行してください。\nCould not get location. Please try outdoors."
            : "位置情報の取得がタイムアウトしました。再試行してください。\nLocation timed out. Please try again.";
        setGpsErrors((prev) => ({ ...prev, [locationIndex]: msg }));
        setGpsLoading(null);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [id, totalLocations]);

  const handleManualCheckin = useCallback((locationIndex: number) => {
    const { isNewLocation, allVisited } = markLocationVisited(id, locationIndex, totalLocations, "manual");
    if (isNewLocation) {
      setVisitedLocations((prev) => [...prev, locationIndex]);
      if (allVisited) {
        setTrophyType("explorer");
        incrementVisitCount(id).catch(() => {});
      }
    }
  }, [id, totalLocations]);

  if (loading || locked === null) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-6 py-12">
          <Skeleton className="mb-6 h-8 w-32" />
          <Skeleton className="mb-4 aspect-video w-full rounded-2xl" />
          <Skeleton className="mb-3 h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>
      </div>
    );
  }

  // Locked: user has not scanned the QR code for this spot yet
  if (locked) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold tracking-widest text-primary">
              EKIREI
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <div className="mb-6 text-6xl">🔒</div>
          <h1 className="mb-3 text-xl font-bold text-foreground">このページはロックされています</h1>
          <p className="text-sm font-medium text-muted-foreground">This page is locked</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            EKIREIのドリップバッグに印刷された<br />
            QRコードを読み取ると解放されます。
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Scan the QR code on your EKIREI drip bag to unlock.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            EKIREIのコーヒーを見る
          </Link>
        </main>
      </div>
    );
  }

  if (!spot) return null;

  const content = getContent(spot, lang);

  const availableLangs = LANGS.filter(({ code }) => {
    if (code === "ja") return true;
    if (code === "en") return !!(spot.nameEn || spot.descriptionEn);
    if (code === "zh") return !!(spot.nameZh || spot.descriptionZh);
    if (code === "ko") return !!(spot.nameKo || spot.descriptionKo);
    return false;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Trophy overlay */}
      {trophyType && spot && (
        <TrophyOverlay
          type={trophyType}
          spotName={spot.name}
          onClose={() => setTrophyType(null)}
        />
      )}

      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-widest text-primary">
            EKIREI
          </Link>
          <Link
            href="/collection"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            <BookOpen size={12} />
            コレクション
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
        {/* Trophy badges */}
        <div className="mb-6 flex gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
              isScanned
                ? "border-[#693c85] bg-[#693c85]/10 text-[#693c85]"
                : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            <span>🎫</span>
            <span>コレクター</span>
          </div>
          {totalLocations > 0 && (
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                visitedLocations.length >= totalLocations
                  ? "border-[#539d84] bg-[#539d84]/10 text-[#539d84]"
                  : visitedLocations.length > 0
                  ? "border-[#539d84]/50 bg-[#539d84]/5 text-[#539d84]/70"
                  : "border-border bg-muted/30 text-muted-foreground"
              }`}
            >
              <span>🗺️</span>
              <span>探訪者{totalLocations > 1 ? ` ${visitedLocations.length}/${totalLocations}` : ""}</span>
            </div>
          )}
        </div>

        {/* Language switcher */}
        {availableLangs.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {availableLangs.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => switchLang(code)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  lang === code
                    ? "bg-primary text-white"
                    : "border border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <span>{flag}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Images */}
        {(() => {
          const imgs: { url: string; caption?: string }[] = spot.images?.length
            ? spot.images
            : spot.imageUrls?.length
            ? spot.imageUrls.map((url) => ({ url }))
            : spot.imageUrl
            ? [{ url: spot.imageUrl }]
            : [];
          if (imgs.length === 0) return null;
          return (
            <div className="mb-8 flex flex-col gap-3">
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <div className="relative aspect-video w-full">
                  <Image
                    src={imgs[0].url}
                    alt={imgs[0].caption || content.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 90vw, 512px"
                    priority
                  />
                </div>
                {imgs[0].caption && (
                  <p className="px-3 py-2 text-xs text-muted-foreground bg-muted/50">{imgs[0].caption}</p>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {imgs.slice(1).map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-xl shadow-sm">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={img.url}
                          alt={img.caption || `${content.name} ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 45vw, 240px"
                        />
                      </div>
                      {img.caption && (
                        <p className="px-2 py-1.5 text-xs text-muted-foreground bg-muted/50">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Content */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-primary">
            <MapPin size={14} />
            <span className="font-medium tracking-wide">EKIREI × 名所</span>
          </div>
          <h1 className="mb-6 text-3xl font-bold leading-tight text-foreground">
            {content.name}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {content.description}
          </p>

          {/* Audio guide button */}
          {audioState !== "unsupported" && (
            <button
              onClick={() => audioState === "playing" ? stopAudio() : speak(content.description || content.name)}
              className={`mt-5 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                audioState === "playing"
                  ? "bg-primary/10 text-primary border border-primary/40"
                  : "bg-[#693c85] text-white hover:opacity-90"
              }`}
            >
              {audioState === "playing" ? (
                <>
                  <Square size={14} className="fill-current" />
                  <span className="flex flex-col items-start leading-tight">
                    <span>音声ガイドを停止</span>
                    <span className="text-xs opacity-70">Stop Audio Guide</span>
                  </span>
                  <span className="ml-1 flex gap-0.5">
                    <span className="inline-block h-3 w-0.5 animate-[bounce_0.6s_ease-in-out_infinite] bg-current" style={{ animationDelay: "0ms" }} />
                    <span className="inline-block h-3 w-0.5 animate-[bounce_0.6s_ease-in-out_infinite] bg-current" style={{ animationDelay: "150ms" }} />
                    <span className="inline-block h-3 w-0.5 animate-[bounce_0.6s_ease-in-out_infinite] bg-current" style={{ animationDelay: "300ms" }} />
                  </span>
                </>
              ) : (
                <>
                  <Volume2 size={14} />
                  <span className="flex flex-col items-start leading-tight">
                    <span>音声ガイドを聴く</span>
                    <span className="text-xs opacity-70">Listen to Audio Guide</span>
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Map & Check-in section */}
        {spotLocations.length > 0 && (
          <div className="mb-8 flex flex-col gap-4">
            {/* Map: center on first location */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm" style={{ height: 240 }}>
              <SpotMap lat={spotLocations[0].lat} lng={spotLocations[0].lng} name={spot.name} />
            </div>

            {/* Per-location check-in cards */}
            {spotLocations.map((loc, i) => {
              const isLocVisited = visitedLocations.includes(i);
              const locGpsLoading = gpsLoading === i;
              const locGpsError = gpsErrors[i];
              const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
              const locLabel = loc.name || (spotLocations.length > 1 ? `場所 ${i + 1}` : "");

              return (
                <div key={i} className="rounded-2xl border border-border bg-muted/20 p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        🗺️ {locLabel ? `${locLabel}` : "訪問チェックイン"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {locLabel ? "Visit Check-in" : "Visit Check-in"}
                      </p>
                    </div>
                    <a
                      href={googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Navigation size={12} />
                      <span>地図</span>
                    </a>
                  </div>

                  {isLocVisited ? (
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#539d84" }}>
                      <CheckCircle2 size={16} />
                      <span className="flex flex-col">
                        <span>訪問済み！</span>
                        <span className="text-xs font-normal opacity-70">Visited</span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleGpsCheckin(i, loc)}
                        disabled={locGpsLoading}
                        className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ background: "#539d84" }}
                      >
                        {locGpsLoading ? (
                          <><Loader2 size={16} className="animate-spin" /><span className="flex flex-col items-start"><span>位置情報を取得中...</span><span className="text-xs font-normal opacity-80">Getting location...</span></span></>
                        ) : (
                          <><Navigation size={16} /><span className="flex flex-col items-start"><span>GPS チェックイン ({GPS_THRESHOLD_METERS}m)</span><span className="text-xs font-normal opacity-80">GPS Check-in</span></span></>
                        )}
                      </button>
                      <button
                        onClick={() => handleManualCheckin(i)}
                        className="flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <CheckCircle2 size={16} />
                        <span className="flex flex-col items-start">
                          <span>手動で訪問済みにする</span>
                          <span className="text-xs font-normal">Mark as Visited</span>
                        </span>
                      </button>
                      {locGpsError && (
                        <p className="text-xs text-destructive leading-relaxed whitespace-pre-line">{locGpsError}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Intro guide (shown instead of coffee note for isIntro spots) */}
        {spot.isIntro ? (
          <div className="flex flex-col gap-3">
            {[
              {
                icon: "🎫",
                color: "#693c85",
                title: lang === "ja" ? "QRコードを読み取る" : lang === "en" ? "Scan a QR Code" : lang === "zh" ? "扫描二维码" : "QR코드 스캔",
                body: lang === "ja"
                  ? "各ドリップバッグの帯についているQRコードを読み取ると、その名所のコレクターバッジを獲得できます。"
                  : lang === "en"
                  ? "Scan the QR code on each drip bag to unlock the Collector badge for that spot."
                  : lang === "zh"
                  ? "扫描每个滴滤袋上的二维码，即可获得该景点的收藏徽章。"
                  : "각 드립백의 QR코드를 스캔하면 해당 명소의 콜렉터 배지를 획득할 수 있습니다.",
              },
              {
                icon: "🗺️",
                color: "#539d84",
                title: lang === "ja" ? "現地を訪問する" : lang === "en" ? "Visit in Person" : lang === "zh" ? "实地探访" : "현지 방문",
                body: lang === "ja"
                  ? "GPSチェックインまたは手動チェックインで現地を訪問すると、探訪者バッジを獲得できます。"
                  : lang === "en"
                  ? "Check in via GPS or manual confirmation when you visit the location to earn the Explorer badge."
                  : lang === "zh"
                  ? "在景点现场进行GPS签到或手动打卡，即可获得探访者徽章。"
                  : "GPS 체크인 또는 수동 체크인으로 현지를 방문하면 탐방자 배지를 획득할 수 있습니다.",
              },
              {
                icon: "📖",
                color: "#693c85",
                title: lang === "ja" ? "コレクションを集める" : lang === "en" ? "Build Your Collection" : lang === "zh" ? "收集名所" : "컬렉션 모으기",
                body: lang === "ja"
                  ? "スタンプ帳ページでコレクションの進捗を確認できます。全制覇を目指しましょう！"
                  : lang === "en"
                  ? "Track your progress on the Stamp Book page. Aim to collect them all!"
                  : lang === "zh"
                  ? "在集章页面查看收集进度，挑战全制覆吧！"
                  : "스탬프 북 페이지에서 컬렉션 진행 상황을 확인하세요. 전부 모아보세요!",
              },
            ].map(({ icon, color, title, body }) => (
              <div key={icon} className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
                  style={{ background: `${color}18` }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Coffee pairing note */
          <div
            className="rounded-2xl p-5 text-sm leading-relaxed"
            style={{ background: "oklch(0.60 0.09 162 / 0.08)" }}
          >
            <p className="mb-1 font-semibold text-primary">
              {lang === "ja" && "このコーヒーについて"}
              {lang === "en" && "About this coffee"}
              {lang === "zh" && "关于这款咖啡"}
              {lang === "ko" && "이 커피에 대해"}
            </p>
            <p className="text-muted-foreground">
              {lang === "ja" && "このドリップバッグは、熊本の風景や文化からインスピレーションを受けたEKIREIオリジナルブレンドです。"}
              {lang === "en" && "This drip bag is an EKIREI original blend inspired by the landscapes and culture of Kumamoto."}
              {lang === "zh" && "这款滴滤咖啡包是受熊本风景与文化启发而创作的EKIREI原创拼配咖啡。"}
              {lang === "ko" && "이 드립백은 구마모토의 풍경과 문화에서 영감을 받아 만든 EKIREI 오리지널 블렌드입니다."}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Link
            href="/collection"
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#693c85" }}
          >
            <BookOpen size={16} />
            {lang === "ja" && <span className="flex flex-col items-center"><span>自分のコレクションを見る</span><span className="text-xs font-normal opacity-80">View My Collection</span></span>}
            {lang === "en" && "View My Collection"}
            {lang === "zh" && <span className="flex flex-col items-center"><span>查看我的收藏</span><span className="text-xs font-normal opacity-80">View My Collection</span></span>}
            {lang === "ko" && <span className="flex flex-col items-center"><span>내 컬렉션 보기</span><span className="text-xs font-normal opacity-80">View My Collection</span></span>}
          </Link>
          <Link
            href="/"
            className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {lang === "ja" && <span>EKIREIのコーヒーをもっと見る<br /><span className="text-xs">Explore More EKIREI Coffees</span></span>}
            {lang === "en" && "Explore More EKIREI Coffees"}
            {lang === "zh" && <span>查看更多EKIREI咖啡<br /><span className="text-xs">Explore More</span></span>}
            {lang === "ko" && <span>EKIREI 커피 더 보기<br /><span className="text-xs">Explore More</span></span>}
          </Link>
        </div>
      </main>
    </div>
  );
}

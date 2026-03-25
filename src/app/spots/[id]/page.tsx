"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Navigation, CheckCircle2, Loader2, BookOpen, Volume2, Square } from "lucide-react";
import { getSpot } from "@/lib/firestore";
import { markScanned, markVisited, getSpotStatus, distanceMeters } from "@/lib/collection";
import { useAudioGuide } from "@/hooks/useAudioGuide";
import type { SpotDoc } from "@/types/admin";
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
  const [isVisited, setIsVisited] = useState(false);
  const [trophyType, setTrophyType] = useState<TrophyType | null>(null);

  // Audio guide
  const { state: audioState, speak, stop: stopAudio } = useAudioGuide(lang);

  // GPS check-in state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // On mount: mark scanned and load status
  useEffect(() => {
    const { isNew } = markScanned(id);
    const status = getSpotStatus(id);
    setIsScanned(status.scanned);
    setIsVisited(status.visited);
    if (isNew) {
      // Show trophy after short delay so page renders first
      setTimeout(() => setTrophyType("collector"), 600);
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

  const handleGpsCheckin = useCallback(() => {
    if (!spot?.lat || !spot?.lng) return;
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = distanceMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          spot.lat!,
          spot.lng!
        );
        if (dist <= GPS_THRESHOLD_METERS) {
          const { isNew } = markVisited(id, "gps");
          setIsVisited(true);
          if (isNew) setTrophyType("explorer");
        } else {
          setGpsError(
            `現在地から約${Math.round(dist)}m離れています。現地（${GPS_THRESHOLD_METERS}m以内）でチェックインしてください。`
          );
        }
        setGpsLoading(false);
      },
      () => {
        setGpsError("位置情報の取得に失敗しました。設定を確認してください。");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [spot, id]);

  const handleManualCheckin = useCallback(() => {
    const { isNew } = markVisited(id, "manual");
    setIsVisited(true);
    if (isNew) setTrophyType("explorer");
  }, [id]);

  const googleMapsUrl =
    spot?.lat && spot?.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
      : null;

  if (loading) {
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
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all ${
              isVisited
                ? "border-[#539d84] bg-[#539d84]/10 text-[#539d84]"
                : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            <span>🗺️</span>
            <span>探訪者</span>
          </div>
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
        {spot.lat && spot.lng && (
          <div className="mb-8 flex flex-col gap-4">
            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm" style={{ height: 240 }}>
              <SpotMap lat={spot.lat} lng={spot.lng} name={spot.name} />
            </div>

            {/* Google Maps link */}
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-border bg-white py-3 text-sm font-medium text-foreground shadow-sm hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Navigation size={16} />
                <span className="flex flex-col items-start">
                  <span>Googleマップで案内する</span>
                  <span className="text-xs font-normal opacity-80">Open in Google Maps</span>
                </span>
              </a>
            )}

            {/* Check-in card */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5">
              <div className="mb-3">
                <p className="text-sm font-semibold text-foreground">🗺️ 訪問チェックイン</p>
                <p className="text-xs text-muted-foreground">Visit Check-in</p>
              </div>

              {isVisited ? (
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#539d84" }}>
                  <CheckCircle2 size={16} />
                  <span className="flex flex-col">
                    <span>訪問済みです！探訪者トロフィー獲得</span>
                    <span className="text-xs font-normal opacity-70">Explorer Trophy Unlocked</span>
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {spot.lat && spot.lng && (
                    <button
                      onClick={handleGpsCheckin}
                      disabled={gpsLoading}
                      className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                      style={{ background: "#539d84" }}
                    >
                      {gpsLoading ? (
                        <><Loader2 size={16} className="animate-spin" /><span className="flex flex-col items-start"><span>位置情報を取得中...</span><span className="text-xs font-normal opacity-80">Getting location...</span></span></>
                      ) : (
                        <><Navigation size={16} /><span className="flex flex-col items-start"><span>GPS チェックイン ({GPS_THRESHOLD_METERS}m)</span><span className="text-xs font-normal opacity-80">GPS Check-in</span></span></>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleManualCheckin}
                    className="flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <CheckCircle2 size={16} />
                    <span className="flex flex-col items-start">
                      <span>手動で訪問済みにする</span>
                      <span className="text-xs font-normal">Mark as Visited</span>
                    </span>
                  </button>
                  {gpsError && (
                    <p className="text-xs text-destructive leading-relaxed">{gpsError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coffee pairing note */}
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

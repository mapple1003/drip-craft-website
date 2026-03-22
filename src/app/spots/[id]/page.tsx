"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { getSpot } from "@/lib/firestore";
import type { SpotDoc } from "@/types/admin";

type Lang = "ja" | "en" | "zh" | "ko";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
];

function getContent(spot: SpotDoc, lang: Lang) {
  switch (lang) {
    case "en":
      return {
        name: spot.nameEn || spot.name,
        description: spot.descriptionEn || spot.description,
      };
    case "zh":
      return {
        name: spot.nameZh || spot.name,
        description: spot.descriptionZh || spot.description,
      };
    case "ko":
      return {
        name: spot.nameKo || spot.name,
        description: spot.descriptionKo || spot.description,
      };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-6 py-12">
          <Skeleton className="mb-6 h-8 w-32" />
          <Skeleton className="mb-4 aspect-square w-full rounded-2xl" />
          <Skeleton className="mb-3 h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!spot) return null;

  const content = getContent(spot, lang);

  // Determine which languages have translations
  const availableLangs = LANGS.filter(({ code }) => {
    if (code === "ja") return true;
    if (code === "en") return !!(spot.nameEn || spot.descriptionEn);
    if (code === "zh") return !!(spot.nameZh || spot.descriptionZh);
    if (code === "ko") return !!(spot.nameKo || spot.descriptionKo);
    return false;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-widest text-primary">
            EKIREI
          </Link>
          <span className="text-xs text-muted-foreground">Specialty Coffee Drip Bag</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
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
          const images = spot.imageUrls?.length ? spot.imageUrls : spot.imageUrl ? [spot.imageUrl] : [];
          if (images.length === 0) return null;
          return (
            <div className="mb-8 flex flex-col gap-3">
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <div className="relative aspect-video w-full">
                  <Image
                    src={images[0]}
                    alt={content.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 90vw, 512px"
                    priority
                  />
                </div>
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {images.slice(1).map((src, i) => (
                    <div key={i} className="overflow-hidden rounded-xl shadow-sm">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={src}
                          alt={`${content.name} ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 45vw, 240px"
                        />
                      </div>
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
        </div>

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

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {lang === "ja" && "EKIREIのコーヒーをもっと見る"}
            {lang === "en" && "Explore more EKIREI coffees"}
            {lang === "zh" && "查看更多EKIREI咖啡"}
            {lang === "ko" && "EKIREI 커피 더 보기"}
          </Link>
        </div>
      </main>
    </div>
  );
}

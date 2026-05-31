"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentHero } from "@/types/admin";

const DEFAULT_HERO: SiteContentHero = {
  heading: "コーヒーの香りと共に、\n一日のはじまりを。",
  subheading:
    "厳選したスペシャルティコーヒーを、ひとつひとつ丁寧にドリップバッグへ。\n自宅で、どこでも、カフェの一杯を。",
  updatedAt: new Date(),
};

// Floating illustration cards for the hero collage
const HERO_ILLUSTS = [
  {
    src: "/images/アイラトビカズラ.png",
    alt: "アイラトビカズラ",
    className:
      "absolute top-0 right-0 w-52 md:w-60 rotate-2 rounded-2xl shadow-lg overflow-hidden z-20",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/さくら湯.png",
    alt: "さくら湯ブレンド",
    className:
      "absolute top-12 left-0 w-44 md:w-52 -rotate-3 rounded-2xl shadow-lg overflow-hidden z-10",
    aspect: "aspect-square",
  },
  {
    src: "/images/チブサン.png",
    alt: "チブサン",
    className:
      "absolute bottom-4 right-4 w-40 md:w-48 rotate-1 rounded-2xl shadow-lg overflow-hidden z-20",
    aspect: "aspect-square",
  },
  {
    src: "/images/猿田彦.png",
    alt: "猿田彦",
    className:
      "absolute bottom-0 left-8 w-36 md:w-44 -rotate-2 rounded-xl shadow-md overflow-hidden z-10",
    aspect: "aspect-[3/4]",
  },
];

function IllustCollage() {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleLoad = (src: string) => setLoaded((prev) => ({ ...prev, [src]: true }));
  const handleError = (src: string) => setErrors((prev) => ({ ...prev, [src]: true }));

  return (
    <div className="relative h-[380px] w-full shrink-0 md:h-[480px] md:w-[480px]">
      {HERO_ILLUSTS.map((illust) => (
        <div key={illust.src} className={illust.className}>
          {!errors[illust.src] ? (
            <div className={`relative w-full ${illust.aspect}`}>
              <Image
                src={illust.src}
                alt={illust.alt}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  loaded[illust.src] ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 768px) 200px, 240px"
                onLoad={() => handleLoad(illust.src)}
                onError={() => handleError(illust.src)}
              />
              {/* Shimmer placeholder before image loads */}
              {!loaded[illust.src] && (
                <div className="absolute inset-0 animate-pulse rounded-2xl bg-muted" />
              )}
            </div>
          ) : (
            // Fallback when image file is missing
            <div
              className={`flex w-full items-center justify-center ${illust.aspect} rounded-2xl bg-muted`}
            >
              <span className="text-3xl">🎨</span>
            </div>
          )}
        </div>
      ))}

      {/* Decorative dots pattern behind illustrations */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.60 0.09 162) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Decorative circle accent */}
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full opacity-20"
        style={{ background: "var(--pop-ochre)" }}
      />
      <div
        className="pointer-events-none absolute -left-6 -top-6 -z-10 h-32 w-32 rounded-full opacity-15"
        style={{ background: "var(--pop-rose)" }}
      />
    </div>
  );
}

export function HeroSection() {
  const [hero, setHero] = useState<SiteContentHero>(DEFAULT_HERO);

  useEffect(() => {
    getSiteContent<SiteContentHero>("hero").then((data) => {
      if (data) setHero(data);
    });
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-16 md:py-24">
      {/* Warm background gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 60% 50%, oklch(0.60 0.09 162 / 0.07) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 60% at 20% 80%, oklch(0.42 0.13 310 / 0.06) 0%, transparent 50%)",
        }}
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:gap-16">
        {/* Text column */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1 text-center md:text-left">
          {/* Pop badge */}
          <div className="mb-6 flex justify-center md:justify-start">
            <Badge
              className="border-none px-4 py-1.5 text-xs font-bold tracking-widest text-white shadow-sm"
              style={{ background: "var(--pop-rose)" }}
            >
              ✦ SPECIALTY DRIP BAG ✦
            </Badge>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-wide text-foreground md:text-5xl lg:text-6xl">
            {hero.heading.split("\n").map((line, i) => (
              <span key={i}>
                {i === 0 ? (
                  line
                ) : (
                  <>
                    <br />
                    <span style={{ color: "var(--pop-rose)" }}>{line}</span>
                  </>
                )}
              </span>
            ))}
          </h1>

          <p className="mb-10 text-base leading-relaxed text-muted-foreground md:text-lg">
            {hero.subheading.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <a href="#products">
              <Button
                size="lg"
                className="min-w-36 border-none text-base text-white shadow-md"
                style={{ background: "var(--brand-green)" }}
              >
                商品を見る
              </Button>
            </a>
            <a href="#story">
              <Button
                size="lg"
                variant="outline"
                className="min-w-36 text-base"
                style={{ borderColor: "var(--pop-rose)", color: "var(--pop-rose)" }}
              >
                ブランドについて
              </Button>
            </a>
          </div>

          {/* Small illustration accent marks */}
          <div className="mt-10 flex items-center gap-3 justify-center md:justify-start">
            <span className="text-2xl">☕</span>
            <span
              className="h-px flex-1 max-w-16"
              style={{ background: "var(--pop-ochre)", opacity: 0.4 }}
            />
            <span className="text-sm font-medium tracking-widest text-muted-foreground">
              EKIREI
            </span>
            <span
              className="h-px flex-1 max-w-16"
              style={{ background: "var(--pop-ochre)", opacity: 0.4 }}
            />
            <span className="text-2xl">✦</span>
          </div>
        </div>

        {/* Illustration collage — right panel */}
        <div className="animate-in fade-in duration-700 w-full md:flex-none">
          <IllustCollage />
        </div>
      </div>
    </section>
  );
}

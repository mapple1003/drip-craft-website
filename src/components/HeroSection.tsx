"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentHero } from "@/types/admin";

const DEFAULT_HERO: SiteContentHero = {
  heading: "コーヒーの香りと共に、\n一日のはじまりを。",
  subheading:
    "厳選したスペシャルティコーヒーを、ひとつひとつ丁寧にドリップバッグへ。自宅で、どこでも、カフェの一杯を。",
  updatedAt: new Date(),
};

// Prefer SVG > PNG for illustrations
function illustSrc(name: string) {
  // SVGが存在すればそちらを優先（Next.jsは静的ファイルをそのまま返す）
  return `/images/${name}.svg`;
}
function illustFallback(name: string) {
  return `/images/${name}.png`;
}

function IllustImage({
  name,
  alt,
  className,
  width,
  height,
}: {
  name: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}) {
  const [src, setSrc] = useState(illustSrc(name));
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setSrc(illustFallback(name))}
      priority
    />
  );
}

export function HeroSection() {
  const [hero, setHero] = useState<SiteContentHero>(DEFAULT_HERO);

  useEffect(() => {
    getSiteContent<SiteContentHero>("hero").then((data) => {
      if (data) setHero(data);
    });
  }, []);

  const [line1, line2] = hero.heading.split("\n");

  return (
    <section className="relative overflow-hidden">
      {/* ── MAIN HERO ─────────────────────────── */}
      <div className="flex min-h-[90vh] flex-col md:flex-row">

        {/* LEFT: dark green panel with text */}
        <div
          className="relative flex flex-1 flex-col justify-center px-8 py-16 md:px-16 md:py-24"
          style={{ background: "#2A4A3A" }}
        >
          {/* Subtle dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 max-w-lg">
            <span
              className="mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.25em] text-white"
              style={{ background: "var(--pop-rose)" }}
            >
              ✦ SPECIALTY DRIP BAG ✦
            </span>

            <h1 className="mb-8 font-bold leading-tight tracking-wide text-white">
              <span className="block text-4xl md:text-5xl lg:text-6xl">{line1}</span>
              <span
                className="block text-4xl md:text-5xl lg:text-6xl"
                style={{ color: "#FFD580" }}
              >
                {line2}
              </span>
            </h1>

            <p className="mb-10 text-base leading-relaxed text-white/75 md:text-lg">
              {hero.subheading}
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#products">
                <Button
                  size="lg"
                  className="min-w-36 border-2 border-transparent text-base text-white shadow-lg"
                  style={{ background: "var(--pop-rose)" }}
                >
                  商品を見る
                </Button>
              </a>
              <a href="#story">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-36 border-2 border-white/50 bg-transparent text-base text-white hover:bg-white/10"
                >
                  ブランドについて
                </Button>
              </a>
            </div>
          </div>

          {/* Bottom-left decoration: small EKIREI label */}
          <div className="absolute bottom-6 left-8 text-xs font-bold tracking-[0.3em] text-white/30">
            EKIREI ✦ COFFEE
          </div>
        </div>

        {/* RIGHT: warm cream panel with illustration */}
        <div
          className="relative flex w-full items-center justify-center overflow-hidden px-8 py-16 md:w-[45%] md:shrink-0"
          style={{ background: "var(--pop-cream)" }}
        >
          {/* Big rotated background text */}
          <span
            className="pointer-events-none absolute select-none text-[10rem] font-black leading-none opacity-[0.04] md:text-[14rem]"
            style={{ color: "#539d84" }}
          >
            EKIREI
          </span>

          {/* さくら湯 illustration — shown at crisp natural size */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <IllustImage
              name="さくら湯"
              alt="さくら湯ブレンド"
              width={420}
              height={420}
              className="w-full max-w-[340px] drop-shadow-xl md:max-w-[420px]"
            />
            <span
              className="rounded-full px-5 py-2 text-sm font-bold text-white shadow"
              style={{ background: "#3A5A80" }}
            >
              さくら湯ブレンド
            </span>
          </div>

          {/* アイラトビカズラ — decorative corner */}
          <div className="absolute -bottom-4 -right-4 opacity-60 rotate-12">
            <IllustImage
              name="アイラトビカズラ"
              alt=""
              width={140}
              height={100}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* ── COLOR STRIP ───────────────────────── */}
      <div
        className="flex items-center justify-center gap-6 overflow-x-auto px-6 py-4 md:gap-10"
        style={{ background: "var(--pop-rose)" }}
      >
        {["山鹿の名所", "手描きイラスト", "ドリップバッグ", "スペシャルティコーヒー", "山鹿の名所"].map(
          (t, i) => (
            <span key={i} className="shrink-0 text-sm font-bold tracking-widest text-white">
              ✦ {t}
            </span>
          )
        )}
      </div>
    </section>
  );
}

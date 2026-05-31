"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IllustImg } from "@/components/IllustImg";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentHero } from "@/types/admin";

const DEFAULT_HERO: SiteContentHero = {
  heading: "コーヒーの香りと共に、\n一日のはじまりを。",
  subheading: "厳選したスペシャルティコーヒーを、ひとつひとつ丁寧にドリップバッグへ。自宅で、どこでも、カフェの一杯を。",
  updatedAt: new Date(),
};

export function HeroSection() {
  const [hero, setHero] = useState<SiteContentHero>(DEFAULT_HERO);

  useEffect(() => {
    getSiteContent<SiteContentHero>("hero").then((d) => { if (d) setHero(d); });
  }, []);

  const [line1, line2] = hero.heading.split("\n");

  return (
    <section className="overflow-hidden">

      {/* ══ HERO: 2カラム ══════════════════════════════ */}
      <div className="flex min-h-[88vh] flex-col md:flex-row">

        {/* 左：イラストが主役 */}
        <div
          className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16"
          style={{ background: "#2C4A3A" }}
        >
          {/* さくら湯 — 大きく、フルクオリティ */}
          <div className="w-full max-w-sm drop-shadow-2xl">
            <IllustImg name="さくら湯" alt="さくら湯ブレンド" className="w-full h-auto" />
          </div>
          <span
            className="rounded-full px-6 py-2 text-sm font-bold tracking-widest text-white"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            さくら湯ブレンド
          </span>

          {/* 右下に不動岩を小さく添える */}
          <div className="w-full max-w-xs opacity-60">
            <IllustImg name="不動岩" alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* 右：テキスト */}
        <div
          className="flex flex-1 flex-col justify-center px-8 py-16 md:px-14"
          style={{ background: "var(--pop-cream)" }}
        >
          {/* ドットパターン */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #539d84 1.5px, transparent 1.5px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative">
            <span
              className="mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.25em] text-white"
              style={{ background: "var(--pop-rose)" }}
            >
              ✦ SPECIALTY DRIP BAG ✦
            </span>

            <h1 className="mb-6 font-black leading-tight text-foreground">
              <span className="block text-3xl md:text-5xl">{line1}</span>
              <span className="block text-3xl md:text-5xl" style={{ color: "var(--pop-rose)" }}>
                {line2}
              </span>
            </h1>

            <p className="mb-10 text-base leading-relaxed text-muted-foreground">
              {hero.subheading}
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#products">
                <Button size="lg" className="text-white" style={{ background: "var(--brand-green)" }}>
                  商品を見る
                </Button>
              </a>
              <a href="#story">
                <Button size="lg" variant="outline" style={{ borderColor: "var(--brand-green)", color: "var(--brand-green)" }}>
                  ブランドについて
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══ カラーマーキー ══════════════════════════════ */}
      <div
        className="flex items-center gap-8 overflow-hidden py-3"
        style={{ background: "var(--pop-rose)" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="shrink-0 text-sm font-bold tracking-widest text-white">
            ✦ EKIREI COFFEE
          </span>
        ))}
      </div>

      {/* ══ イラストショーケース（全7点横並び）════════ */}
      <div style={{ background: "#1A2A20" }} className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-4 gap-4 md:grid-cols-7">
            {[
              { name: "さくら湯",       label: "さくら湯",   bg: "#3A5A80" },
              { name: "アイラトビカズラ", label: "アイラ",     bg: "#5A3020" },
              { name: "チブサン",       label: "チブサン",   bg: "#B06070" },
              { name: "チブサン_宇宙人", label: "チブサン古墳",bg: "#8B2020" },
              { name: "不動岩",         label: "不動岩",     bg: "#3A5C3A" },
              { name: "猿田彦",         label: "猿田彦",     bg: "#2A2420" },
              { name: "石人",           label: "石人",       bg: "#7A6040" },
            ].map((illust) => (
              <div
                key={illust.name}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-full overflow-hidden rounded-xl p-2 transition-transform duration-200 group-hover:scale-105"
                  style={{ background: illust.bg }}
                >
                  <IllustImg
                    name={illust.name}
                    alt={illust.label}
                    className="w-full h-auto"
                  />
                </div>
                <span className="text-center text-[10px] font-medium text-white/60 md:text-xs">
                  {illust.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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

      {/* ══ HERO: さくら湯が背景、文字がその上に ══ */}
      <div className="relative flex min-h-[90vh] items-center overflow-hidden">

        {/* レイヤー1: さくら湯イラスト — 全面背景 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/さくら湯.svg"
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        {/* レイヤー2: 左から右へのグラデーションオーバーレイ（文字可読性確保） */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(20,45,30,0.96) 0%, rgba(20,45,30,0.88) 35%, rgba(20,45,30,0.55) 60%, rgba(20,45,30,0.15) 100%)",
          }}
        />

        {/* レイヤー3: 文字・ボタン — イラストの上に重ねる */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-8 py-16">
          <div className="max-w-xl">
            <span
              className="mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.25em] text-white"
              style={{ background: "var(--pop-rose)" }}
            >
              ✦ SPECIALTY DRIP BAG ✦
            </span>
            <h1 className="mb-6 font-black leading-tight text-white">
              <span className="block text-4xl md:text-6xl lg:text-7xl drop-shadow-lg">{line1}</span>
              <span className="block text-4xl md:text-6xl lg:text-7xl drop-shadow-lg" style={{ color: "#FFD580" }}>
                {line2}
              </span>
            </h1>
            <p className="mb-10 text-base leading-relaxed text-white/80 md:text-lg">
              {hero.subheading}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#products">
                <Button size="lg" className="text-base text-white shadow-xl" style={{ background: "var(--pop-rose)" }}>
                  商品を見る
                </Button>
              </a>
              <a href="#story">
                <Button size="lg"
                  className="border-2 border-white/60 bg-transparent text-base text-white backdrop-blur-sm hover:bg-white/15">
                  ブランドについて
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* レイヤー3: 右下に不動岩 — 浮かせて配置 */}
        <div className="absolute bottom-0 right-0 z-10 w-[45%] max-w-md opacity-80 drop-shadow-2xl md:block hidden">
          <IllustImg name="不動岩" alt="" className="w-full h-auto" />
        </div>
      </div>

      {/* ══ ピンク帯マーキー ══ */}
      <div className="flex items-center gap-8 overflow-hidden py-3" style={{ background: "var(--pop-rose)" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="shrink-0 text-sm font-bold tracking-widest text-white">✦ EKIREI COFFEE</span>
        ))}
      </div>

      {/* ══ 全7点イラスト — 暗い帯の上に並べる ══ */}
      <div className="overflow-hidden px-4 py-10 md:px-8" style={{ background: "#1C2E22" }}>
        <p className="mb-5 text-center text-[10px] font-bold tracking-[0.3em] text-white/30">✦ ILLUSTRATION COLLECTION ✦</p>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-4 gap-3 md:grid-cols-7 md:gap-4">
            {[
              { name: "さくら湯",        label: "さくら湯",  bg: "#3A5A80" },
              { name: "アイラトビカズラ", label: "アイラ",    bg: "#5A3020" },
              { name: "チブサン",         label: "チブサン",  bg: "#B06070" },
              { name: "チブサン_宇宙人",  label: "古墳",      bg: "#8B2020" },
              { name: "不動岩",           label: "不動岩",    bg: "#3A5C3A" },
              { name: "猿田彦",           label: "猿田彦",    bg: "#2A2420" },
              { name: "石人",             label: "石人",      bg: "#7A6040" },
            ].map((it) => (
              <div key={it.name} className="group flex flex-col items-center gap-1.5">
                <div
                  className="w-full overflow-hidden rounded-xl p-2 shadow-md transition-transform duration-200 group-hover:scale-105"
                  style={{ background: it.bg }}
                >
                  <IllustImg name={it.name} alt={it.label} className="w-full h-auto" />
                </div>
                <span className="text-[9px] font-medium text-white/40 md:text-[11px]">{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

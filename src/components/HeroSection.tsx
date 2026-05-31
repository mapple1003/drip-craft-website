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

      {/* ══ HERO: テキスト先、イラスト後 ══ */}
      <div className="flex flex-col md:flex-row md:min-h-[85vh]">

        {/* テキストパネル — DOM上で先に来るのでモバイルでも上に表示 */}
        <div
          className="relative flex flex-1 flex-col justify-center overflow-hidden px-8 py-14 md:px-14 md:py-20"
          style={{ background: "var(--pop-cream)" }}
        >
          {/* ドット背景 */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage:"radial-gradient(circle,#539d84 1.5px,transparent 1.5px)", backgroundSize:"22px 22px" }} />

          <div className="relative z-10 max-w-lg">
            <span className="mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.25em] text-white"
              style={{ background:"var(--pop-rose)" }}>
              ✦ SPECIALTY DRIP BAG ✦
            </span>
            <h1 className="mb-6 font-black leading-tight text-foreground">
              <span className="block text-3xl md:text-5xl lg:text-6xl">{line1}</span>
              <span className="block text-3xl md:text-5xl lg:text-6xl" style={{ color:"var(--pop-rose)" }}>{line2}</span>
            </h1>
            <p className="mb-8 leading-relaxed text-muted-foreground">{hero.subheading}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#products">
                <Button size="lg" className="text-white shadow-md" style={{ background:"var(--brand-green)" }}>
                  商品を見る
                </Button>
              </a>
              <a href="#story">
                <Button size="lg" variant="outline" style={{ borderColor:"var(--brand-green)", color:"var(--brand-green)" }}>
                  ブランドについて
                </Button>
              </a>
            </div>
          </div>

          {/* コーナーにアイラトビカズラ — 装飾 */}
          <div className="pointer-events-none absolute -bottom-8 -right-4 w-36 opacity-25 rotate-12 md:w-44">
            <IllustImg name="アイラトビカズラ" alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* イラストパネル */}
        <div
          className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-12 md:py-0"
          style={{ background:"#2C4A3A" }}
        >
          <div className="w-full max-w-sm drop-shadow-2xl">
            <IllustImg name="さくら湯" alt="さくら湯ブレンド" className="w-full h-auto" />
          </div>
          <span className="rounded-full px-5 py-1.5 text-sm font-bold tracking-wide text-white"
            style={{ background:"rgba(255,255,255,0.15)" }}>
            さくら湯ブレンド
          </span>
          <div className="w-full max-w-xs opacity-70">
            <IllustImg name="不動岩" alt="不動岩ブレンド" className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* ══ ピンクマーキー帯 ══ */}
      <div className="flex items-center gap-8 overflow-hidden py-3" style={{ background:"var(--pop-rose)" }}>
        {Array.from({length:10}).map((_,i) => (
          <span key={i} className="shrink-0 text-sm font-bold tracking-widest text-white">✦ EKIREI COFFEE</span>
        ))}
      </div>

      {/* ══ 全イラストショーケース ══ */}
      <div style={{ background:"#1C2E22" }} className="px-4 py-10 md:px-8">
        <p className="mb-6 text-center text-xs font-bold tracking-[0.3em] text-white/40">✦ ILLUSTRATION COLLECTION ✦</p>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-4 gap-3 md:grid-cols-7 md:gap-4">
            {[
              { name:"さくら湯",        label:"さくら湯",    bg:"#3A5A80" },
              { name:"アイラトビカズラ",  label:"アイラ",      bg:"#5A3020" },
              { name:"チブサン",         label:"チブサン",    bg:"#B06070" },
              { name:"チブサン_宇宙人",  label:"古墳",        bg:"#8B2020" },
              { name:"不動岩",           label:"不動岩",      bg:"#3A5C3A" },
              { name:"猿田彦",           label:"猿田彦",      bg:"#2A2420" },
              { name:"石人",             label:"石人",        bg:"#7A6040" },
            ].map((it) => (
              <div key={it.name} className="group flex flex-col items-center gap-1.5">
                <div className="w-full overflow-hidden rounded-xl p-2 transition-transform duration-200 group-hover:scale-105 shadow-md"
                  style={{ background:it.bg }}>
                  <IllustImg name={it.name} alt={it.label} className="w-full h-auto" />
                </div>
                <span className="text-center text-[9px] font-medium text-white/50 md:text-[11px]">{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

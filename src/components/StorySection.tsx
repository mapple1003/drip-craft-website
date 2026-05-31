"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Leaf, Heart, Star } from "lucide-react";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentStory } from "@/types/admin";

const ICONS = [Leaf, Heart, Star];

const DEFAULT_VALUES = [
  { title: "産地への敬意", description: "コーヒーの産地を訪れ、生産者と直接対話しながら豆を選びます。" },
  { title: "丁寧な焙煎", description: "少量ずつ、豆の個性を最大限に引き出す焙煎プロファイルで仕上げます。" },
  { title: "簡単・美味しい", description: "マグカップにセットしてお湯を注ぐだけ。カフェクオリティのコーヒーが楽しめます。" },
];

const DEFAULT_STORY: SiteContentStory = {
  heading: "一杯のコーヒーに、\n想いを込めて。",
  body1: "EKIREI は、コーヒー好きが高じて始めた小さなブランドです。世界各地の農園を巡り、「これだ」と思える豆だけを仕入れ、一つひとつ丁寧にドリップバッグへと仕上げています。",
  body2: "忙しい朝でも、旅先でも、どこにいても本格的なコーヒーを楽しんでほしい——そんな想いからドリップバッグという形を選びました。",
  updatedAt: new Date(),
};

function IllustImage({ name, alt, width, height, className }: {
  name: string; alt: string; width: number; height: number; className?: string;
}) {
  const [src, setSrc] = useState(`/images/${name}.svg`);
  return (
    <Image src={src} alt={alt} width={width} height={height} className={className}
      onError={() => setSrc(`/images/${name}.png`)} />
  );
}

export function StorySection() {
  const [story, setStory] = useState<SiteContentStory>(DEFAULT_STORY);

  useEffect(() => {
    getSiteContent<SiteContentStory>("story").then((data) => {
      if (data) setStory(data);
    });
  }, []);

  const values = story.values?.length ? story.values : DEFAULT_VALUES;

  return (
    <section id="story" className="overflow-hidden">

      {/* ── TOP: FULL-WIDTH COLORED BAND ──── */}
      <div
        className="relative flex items-center justify-center px-6 py-16 text-center md:py-20"
        style={{ background: "#693c85" }}
      >
        {/* チブサン illustration — decorative right side */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-48 overflow-hidden opacity-25 md:w-64">
          <IllustImage name="チブサン" alt="" width={300} height={300}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-full object-contain" />
        </div>
        <div className="pointer-events-none absolute left-0 top-0 h-full w-48 overflow-hidden opacity-25 md:w-64">
          <IllustImage name="アイラトビカズラ" alt="" width={300} height={220}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full object-contain" />
        </div>

        <div className="relative z-10 max-w-2xl text-white">
          <p className="mb-4 text-sm font-bold tracking-[0.3em] text-white/60">✦ OUR STORY ✦</p>
          <h2 className="mb-0 text-4xl font-black leading-tight md:text-6xl">
            {story.heading.split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h2>
        </div>
      </div>

      {/* ── BOTTOM: TEXT + VALUES ─────────── */}
      <div className="px-6 py-16 md:py-20" style={{ background: "var(--pop-cream)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            {/* Left: story text */}
            <div>
              <p className="mb-5 text-base leading-relaxed text-muted-foreground md:text-lg">{story.body1}</p>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{story.body2}</p>

              {/* アイラトビカズラ as story accent illustration */}
              <div className="mt-8 overflow-hidden rounded-2xl shadow-lg">
                {story.imageUrl ? (
                  <Image src={story.imageUrl} alt="ブランドストーリー" width={520} height={300}
                    className="w-full object-cover" sizes="(max-width: 768px) 90vw, 520px" quality={90} />
                ) : (
                  <div style={{ background: "#5A3020" }} className="flex items-center justify-center p-8">
                    <IllustImage name="アイラトビカズラ" alt="アイラトビカズラ"
                      width={400} height={280} className="w-full max-w-sm object-contain" />
                  </div>
                )}
              </div>
            </div>

            {/* Right: values */}
            <div className="flex flex-col gap-6">
              {values.map((v, i) => {
                const Icon = ICONS[i] ?? Leaf;
                const colors = ["var(--pop-rose)", "var(--brand-green)", "var(--brand-purple)"];
                return (
                  <div key={i} className="flex gap-4">
                    <div
                      className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                      style={{ background: colors[i] }}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="mb-1 font-bold text-foreground">{v.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                    </div>
                  </div>
                );
              })}

              {/* さくら湯 illustration as decorative panel */}
              <div className="mt-4 overflow-hidden rounded-2xl shadow-lg">
                <div style={{ background: "#3A5A80" }} className="flex items-center justify-center p-6">
                  <IllustImage name="さくら湯" alt="さくら湯ブレンド"
                    width={300} height={220} className="w-full max-w-xs object-contain drop-shadow-lg" />
                </div>
                <div className="bg-card px-4 py-3 text-center">
                  <p className="text-sm font-bold text-muted-foreground">さくら湯ブレンド</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

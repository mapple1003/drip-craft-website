"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Leaf, Heart, Star } from "lucide-react";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentStory } from "@/types/admin";
import { IllustImg } from "@/components/IllustImg";

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

export function StorySection() {
  const [story, setStory] = useState<SiteContentStory>(DEFAULT_STORY);

  useEffect(() => {
    getSiteContent<SiteContentStory>("story").then((d) => { if (d) setStory(d); });
  }, []);

  const values = story.values?.length ? story.values : DEFAULT_VALUES;

  return (
    <section id="story" className="overflow-hidden">

      {/* ── パープルバナー ─── */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
        style={{ background: "#693c85" }}
      >
        {/* 左右にイラスト装飾 */}
        <div className="pointer-events-none absolute left-0 top-1/2 w-36 -translate-y-1/2 opacity-30 md:w-48">
          <IllustImg name="チブサン" alt="" className="w-full h-auto" />
        </div>
        <div className="pointer-events-none absolute right-0 top-1/2 w-36 -translate-y-1/2 -scale-x-100 opacity-30 md:w-48">
          <IllustImg name="アイラトビカズラ" alt="" className="w-full h-auto" />
        </div>

        <div className="relative z-10 text-white">
          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-white/60">✦ OUR STORY ✦</p>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            {story.heading.split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h2>
        </div>
      </div>

      {/* ── 本文 + バリュー ─── */}
      <div className="px-6 py-16" style={{ background: "var(--pop-cream)" }}>
        <div className="mx-auto max-w-6xl grid gap-16 md:grid-cols-2">

          {/* 左：テキスト + アイラトビカズラ */}
          <div>
            <p className="mb-5 leading-relaxed text-muted-foreground">{story.body1}</p>
            <p className="mb-8 leading-relaxed text-muted-foreground">{story.body2}</p>

            {story.imageUrl ? (
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image src={story.imageUrl} alt="ブランドストーリー"
                  width={520} height={300} className="w-full object-cover" quality={90} />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl shadow-xl" style={{ background: "#5A3020" }}>
                <IllustImg name="アイラトビカズラ" alt="アイラトビカズラ" className="w-full h-auto" />
              </div>
            )}
          </div>

          {/* 右：バリュー + チブサン */}
          <div className="flex flex-col gap-6">
            {values.map((v, i) => {
              const Icon = ICONS[i] ?? Leaf;
              const bgs = ["var(--pop-rose)", "var(--brand-green)", "var(--brand-purple)"];
              return (
                <div key={i} className="flex gap-4">
                  <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                    style={{ background: bgs[i] }}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="mb-1 font-bold text-foreground">{v.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                  </div>
                </div>
              );
            })}

            {/* チブサン — 大きくフィーチャー */}
            <div className="mt-4 overflow-hidden rounded-2xl shadow-xl" style={{ background: "#B06070" }}>
              <IllustImg name="チブサン" alt="チブサン" className="w-full h-auto" />
              <div className="bg-card px-4 py-3 text-center">
                <p className="text-sm font-bold text-muted-foreground">チブサン</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

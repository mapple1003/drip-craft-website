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
  body1: "EKIREIは、コーヒー好きが高じて始めた小さなブランドです。世界各地の農園を巡り、「これだ」と思える豆だけを仕入れ、一つひとつ丁寧にドリップバッグへと仕上げています。",
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

      {/* ── チブサンを背景に大見出しを重ねる ── */}
      <div className="relative min-h-[50vh] overflow-hidden flex items-center">
        {/* レイヤー1: チブサンイラスト — 全面背景 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/チブサン.svg"
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
        {/* レイヤー2: チブサンのピンク系カラーのオーバーレイ */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(160,60,90,0.92) 0%, rgba(105,30,80,0.85) 50%, rgba(80,20,60,0.75) 100%)" }}
        />
        {/* レイヤー3: 大見出し — イラストの上に */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-8 py-16 text-white">
          <p className="mb-3 text-xs font-bold tracking-[0.4em] text-white/50">✦ OUR STORY ✦</p>
          <h2 className="text-5xl font-black leading-tight drop-shadow-lg md:text-7xl">
            {story.heading.split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h2>
        </div>
      </div>

      {/* ── 本文: アイラトビカズラカラーの背景 + 右にイラスト ── */}
      <div className="relative overflow-hidden px-6 py-16" style={{ background: "#2A1408" }}>
        {/* アイラトビカズラ — 右に薄く配置 */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20">
          <IllustImg name="アイラトビカズラ" alt="" className="h-full w-full object-cover object-left" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-5 leading-relaxed text-white/80">{story.body1}</p>
            <p className="mb-8 leading-relaxed text-white/80">{story.body2}</p>

            {story.imageUrl ? (
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image src={story.imageUrl} alt="ブランドストーリー"
                  width={520} height={300} className="w-full object-cover" quality={90} />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <IllustImg name="アイラトビカズラ" alt="" className="w-full h-auto" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {values.map((v, i) => {
              const Icon = ICONS[i] ?? Leaf;
              const colors = ["var(--pop-rose)", "var(--brand-green)", "#FFD580"];
              return (
                <div key={i} className="flex gap-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: colors[i] }}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="mb-1 font-bold text-white">{v.title}</p>
                    <p className="text-sm leading-relaxed text-white/65">{v.description}</p>
                  </div>
                </div>
              );
            })}

            {/* さくら湯 — ここにも配置 */}
            <div className="mt-2 overflow-hidden rounded-2xl shadow-xl">
              <div style={{ background: "#3A5A80" }} className="flex items-center justify-center p-6">
                <IllustImg name="さくら湯" alt="さくら湯ブレンド" className="w-full max-w-xs h-auto drop-shadow-xl" />
              </div>
              <div className="py-2 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-xs font-bold text-white/60 tracking-widest">さくら湯ブレンド</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

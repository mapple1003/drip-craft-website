"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Leaf, Heart, Star } from "lucide-react";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentStory } from "@/types/admin";

const values = [
  { icon: Leaf, title: "産地への敬意", description: "コーヒーの産地を訪れ、生産者と直接対話しながら豆を選びます。フェアな取引と持続可能な農業を支援しています。" },
  { icon: Heart, title: "丁寧な焙煎", description: "少量ずつ、豆の個性を最大限に引き出す焙煎プロファイルで仕上げます。注文後に焙煎することで、常に新鮮な状態でお届けします。" },
  { icon: Star, title: "簡単・美味しい", description: "ドリップバッグだから、特別な器具は不要。マグカップにセットしてお湯を注ぐだけで、カフェクオリティのコーヒーが楽しめます。" },
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
    getSiteContent<SiteContentStory>("story").then((data) => {
      if (data) setStory(data);
    });
  }, []);

  return (
    <section id="story" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-medium tracking-widest text-primary">OUR STORY</p>
            <h2 className="mb-6 text-3xl font-bold leading-snug text-foreground md:text-4xl">
              {story.heading.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">{story.body1}</p>
            <p className="mb-8 leading-relaxed text-muted-foreground">{story.body2}</p>
            <Separator className="mb-8" />
            <div className="flex flex-col gap-6">
              {values.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "oklch(0.60 0.09 162 / 0.12)" }}>
                    <v.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-foreground">{v.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl" style={{ background: "linear-gradient(135deg, oklch(0.60 0.09 162 / 0.15) 0%, oklch(0.42 0.13 310 / 0.15) 100%)" }}>
              <div className="absolute inset-8 flex flex-col items-center justify-center gap-6 text-center">
                <div className="text-8xl">☕</div>
                <blockquote className="text-lg font-semibold italic leading-relaxed text-foreground/70">
                  &ldquo;Good coffee is a pleasure.<br />Good friends are a treasure.&rdquo;
                </blockquote>
                <div className="h-px w-16" style={{ background: "oklch(0.60 0.09 162 / 0.4)" }} />
                <p className="text-sm tracking-widest text-muted-foreground">EKIREI</p>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 flex flex-col items-center justify-center rounded-2xl px-4 py-3 text-center shadow-md" style={{ background: "#693c85", color: "white" }}>
              <span className="text-2xl font-bold">4</span>
              <span className="text-xs">フレーバー</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

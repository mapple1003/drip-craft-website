"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Leaf, Heart, Star } from "lucide-react";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentStory } from "@/types/admin";

const ICONS = [Leaf, Heart, Star];

const DEFAULT_VALUES = [
  { title: "産地への敬意", description: "コーヒーの産地を訪れ、生産者と直接対話しながら豆を選びます。フェアな取引と持続可能な農業を支援しています。" },
  { title: "丁寧な焙煎", description: "少量ずつ、豆の個性を最大限に引き出す焙煎プロファイルで仕上げます。注文後に焙煎することで、常に新鮮な状態でお届けします。" },
  { title: "簡単・美味しい", description: "ドリップバッグだから、特別な器具は不要。マグカップにセットしてお湯を注ぐだけで、カフェクオリティのコーヒーが楽しめます。" },
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

  const values = story.values?.length ? story.values : DEFAULT_VALUES;

  return (
    <section id="story" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold tracking-widest" style={{ color: "var(--brand-green)" }}>✦ OUR STORY ✦</p>
            <h2 className="mb-1 text-3xl font-bold leading-snug text-foreground md:text-4xl">
              {story.heading.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h2>
            <p className="mb-6 text-sm tracking-wide text-muted-foreground">Our Story</p>
            <p className="mb-6 leading-relaxed text-muted-foreground">{story.body1}</p>
            <p className="mb-8 leading-relaxed text-muted-foreground">{story.body2}</p>
            <Separator className="mb-8" />
            <div className="flex flex-col gap-6">
              {values.map((v, i) => {
                const Icon = ICONS[i] ?? Leaf;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "oklch(0.60 0.09 162 / 0.12)" }}>
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="mb-1 font-semibold text-foreground">{v.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: illustration collage */}
          <div className="relative flex items-center justify-center">
            {story.imageUrl ? (
              <div className="overflow-hidden rounded-3xl shadow-lg">
                <div className="relative aspect-square w-full">
                  <Image
                    src={story.imageUrl}
                    alt="ブランドストーリー"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 500px"
                  />
                </div>
              </div>
            ) : (
              /* Illustration collage: bear + saruta side by side */
              <div className="relative h-80 w-full max-w-md md:h-96">
                {/* Saruta — large, left, slightly rotated */}
                <div className="absolute bottom-0 left-4 w-48 -rotate-3 overflow-hidden rounded-2xl shadow-lg md:w-56">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src="/images/illust-saruta.png"
                      alt="サルタヒコ"
                      fill
                      className="object-cover"
                      sizes="224px"
                    />
                  </div>
                </div>
                {/* Bear — right, overlapping slightly */}
                <div className="absolute right-4 top-4 w-44 rotate-2 overflow-hidden rounded-2xl shadow-lg md:w-52">
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/images/illust-bear.png"
                      alt="チブサン"
                      fill
                      className="object-cover"
                      sizes="208px"
                    />
                  </div>
                </div>
                {/* Decorative dots */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, var(--pop-rose) 1.5px, transparent 1.5px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                {/* Coffee accent text */}
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest text-white shadow-md"
                  style={{ background: "var(--pop-ochre)" }}
                >
                  ✦ STORY ✦
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

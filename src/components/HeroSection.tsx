"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentHero } from "@/types/admin";

const DEFAULT_HERO: SiteContentHero = {
  heading: "コーヒーの香りと共に、\n一日のはじまりを。",
  subheading:
    "厳選したスペシャルティコーヒーを、ひとつひとつ丁寧にドリップバッグへ。\n自宅で、どこでも、カフェの一杯を。",
  updatedAt: new Date(),
};

export function HeroSection() {
  const [hero, setHero] = useState<SiteContentHero>(DEFAULT_HERO);

  useEffect(() => {
    getSiteContent<SiteContentHero>("hero").then((data) => {
      if (data) setHero(data);
    });
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* さくら湯 illustration — full-width banner background */}
      <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden md:h-[85vh]">
        <Image
          src="/images/さくら湯.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={95}
        />
        {/* Gradient overlay so text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        {/* Text content — centered left */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-8">
            <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Brand label */}
              <p
                className="mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.25em] text-white"
                style={{ background: "var(--pop-rose)" }}
              >
                ✦ SPECIALTY DRIP BAG ✦
              </p>

              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-wide text-white md:text-5xl lg:text-6xl">
                {hero.heading.split("\n").map((line, i) => (
                  <span key={i}>
                    {i === 0 ? (
                      line
                    ) : (
                      <>
                        <br />
                        <span style={{ color: "#FFD580" }}>{line}</span>
                      </>
                    )}
                  </span>
                ))}
              </h1>

              <p className="mb-10 text-base leading-relaxed text-white/85 md:text-lg">
                {hero.subheading.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#products">
                  <Button
                    size="lg"
                    className="min-w-36 border-none text-base text-white shadow-lg"
                    style={{ background: "var(--brand-green)" }}
                  >
                    商品を見る
                  </Button>
                </a>
                <a href="#story">
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-36 border-2 border-white/60 bg-transparent text-base text-white backdrop-blur-sm hover:bg-white/10"
                  >
                    ブランドについて
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* アイラトビカズラ illustration — right accent panel */}
        <div className="absolute bottom-0 right-0 hidden h-full w-[38%] md:block">
          <Image
            src="/images/アイラトビカズラ.png"
            alt="アイラトビカズラ"
            fill
            className="object-cover object-left"
            priority
            sizes="40vw"
            quality={95}
          />
          {/* Blend left edge into the overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 40%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

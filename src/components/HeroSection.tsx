"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentHero } from "@/types/admin";

const DEFAULT_HERO: SiteContentHero = {
  heading: "コーヒーの香りと共に、\n一日のはじまりを。",
  subheading: "厳選したスペシャルティコーヒーを、ひとつひとつ丁寧にドリップバッグへ。\n自宅で、どこでも、カフェの一杯を。",
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
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.60 0.09 162 / 0.12), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 20%, oklch(0.42 0.13 310 / 0.08), transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-primary/5" />
        <div className="absolute right-[15%] top-[30%] h-20 w-20 rounded-full bg-accent/10" />
        <div className="absolute bottom-[20%] left-[20%] h-16 w-16 rounded-full bg-primary/8" />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl">
        <Badge
          className="mb-6 border-none px-4 py-1.5 text-xs tracking-widest"
          style={{ background: "oklch(0.60 0.09 162 / 0.15)", color: "oklch(0.50 0.09 162)" }}
        >
          SPECIALTY COFFEE DRIP BAG
        </Badge>

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-wide text-foreground md:text-6xl">
          {hero.heading.split("\n").map((line, i) => (
            <span key={i}>
              {i === 0 ? line : <><br /><span className="text-primary">{line}</span></>}
            </span>
          ))}
        </h1>

        <p className="mb-10 text-base leading-relaxed text-muted-foreground md:text-lg">
          {hero.subheading.split("\n").map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href="#products">
            <Button size="lg" className="min-w-36 text-base">商品を見る</Button>
          </a>
          <a href="#story">
            <Button size="lg" variant="outline" className="min-w-36 text-base border-primary/30 text-primary hover:bg-primary/5">
              ブランドについて
            </Button>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/40">
        <ArrowDown size={20} />
      </div>
    </section>
  );
}

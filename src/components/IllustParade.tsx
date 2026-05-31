"use client";

import Image from "next/image";
import { useState } from "react";

// Illustration data — matches the 5 hand-drawn product illustrations
const ILLUSTS = [
  {
    src: "/images/illust-warabi.png",
    name: "ワラビナブレンド",
    bg: "#6B3A28",
    rotate: "-rotate-2",
  },
  {
    src: "/images/illust-sakurayu.png",
    name: "さくら湯ブレンド",
    bg: "#3A5A80",
    rotate: "rotate-1",
  },
  {
    src: "/images/illust-chibusankofun.png",
    name: "チブサン古墳",
    bg: "#8B2020",
    rotate: "-rotate-1",
  },
  {
    src: "/images/illust-bear.png",
    name: "チブサン",
    bg: "#B06070",
    rotate: "rotate-2",
  },
  {
    src: "/images/illust-saruta.png",
    name: "サルタヒコ",
    bg: "#2A2420",
    rotate: "-rotate-2",
  },
];

function IllustCard({
  src,
  name,
  bg,
  rotate,
}: {
  src: string;
  name: string;
  bg: string;
  rotate: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group flex shrink-0 flex-col items-center gap-2">
      <div
        className={`relative h-28 w-28 overflow-hidden rounded-2xl shadow-md transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg ${rotate} md:h-36 md:w-36`}
        style={{ background: hasError ? bg : undefined }}
      >
        {!hasError ? (
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 112px, 144px"
            onError={() => setHasError(true)}
          />
        ) : (
          // Fallback placeholder with initials when image file is not yet added
          <div
            className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/80"
            style={{ background: bg }}
          >
            {name.slice(0, 2)}
          </div>
        )}
      </div>
      <span className="text-center text-xs font-medium text-muted-foreground md:text-sm">
        {name}
      </span>
    </div>
  );
}

export function IllustParade({ variant = "section" }: { variant?: "section" | "footer" }) {
  if (variant === "footer") {
    return (
      <div className="overflow-hidden border-t pt-8">
        <div className="flex items-end justify-center gap-4 px-6 md:gap-8">
          {ILLUSTS.map((illust) => (
            <IllustCard key={illust.src} {...illust} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      className="overflow-hidden py-12"
      style={{ background: "var(--pop-cream)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="text-sm font-medium tracking-widest text-muted-foreground">
            ✦ イラスト図鑑 ✦
          </p>
        </div>

        {/* Illustration row — horizontal scroll on mobile */}
        <div className="flex items-end justify-start gap-6 overflow-x-auto pb-4 md:justify-center md:gap-10">
          {ILLUSTS.map((illust) => (
            <IllustCard key={illust.src} {...illust} />
          ))}
        </div>
      </div>
    </section>
  );
}

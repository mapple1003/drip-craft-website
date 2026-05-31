"use client";

import Image from "next/image";
import { useState } from "react";

// All 7 hand-drawn product illustrations — filenames as saved by artist
const ILLUSTS = [
  {
    src: "/images/アイラトビカズラ.png",
    name: "アイラトビカズラ",
    bg: "#5A3020",
    rotate: "-rotate-2",
  },
  {
    src: "/images/さくら湯.png",
    name: "さくら湯ブレンド",
    bg: "#3A5A80",
    rotate: "rotate-1",
  },
  {
    src: "/images/チブサン_宇宙人.png",
    name: "チブサン古墳",
    bg: "#8B2020",
    rotate: "-rotate-1",
  },
  {
    src: "/images/チブサン.png",
    name: "チブサン",
    bg: "#B06070",
    rotate: "rotate-2",
  },
  {
    src: "/images/猿田彦.png",
    name: "猿田彦",
    bg: "#2A2420",
    rotate: "-rotate-2",
  },
  {
    src: "/images/石人2.png",
    name: "石人",
    bg: "#7A6040",
    rotate: "rotate-1",
  },
  {
    src: "/images/不動岩.png",
    name: "不動岩ブレンド",
    bg: "#3A5C3A",
    rotate: "-rotate-1",
  },
];

function IllustCard({
  src,
  name,
  bg,
  rotate,
  size = "md",
}: {
  src: string;
  name: string;
  bg: string;
  rotate: string;
  size?: "sm" | "md";
}) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const sizeClass = size === "sm"
    ? "h-24 w-24 md:h-28 md:w-28"
    : "h-28 w-28 md:h-36 md:w-36";

  return (
    <div className="group flex shrink-0 flex-col items-center gap-2">
      <div
        className={`relative overflow-hidden rounded-2xl shadow-md transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg ${rotate} ${sizeClass}`}
        style={{ background: bg }}
      >
        {!hasError ? (
          <>
            <Image
              src={src}
              alt={name}
              fill
              className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 768px) 112px, 144px"
              onLoad={() => setLoaded(true)}
              onError={() => setHasError(true)}
            />
            {!loaded && (
              <div className="absolute inset-0 animate-pulse" style={{ background: bg }} />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/80">
            {name.slice(0, 2)}
          </div>
        )}
      </div>
      <span className="text-center text-xs font-medium text-muted-foreground">
        {name}
      </span>
    </div>
  );
}

export function IllustParade({ variant = "section" }: { variant?: "section" | "footer" }) {
  if (variant === "footer") {
    return (
      <div className="overflow-hidden border-t pt-8">
        <div className="flex flex-wrap items-end justify-center gap-4 px-6 md:gap-6">
          {ILLUSTS.map((illust) => (
            <IllustCard key={illust.src} {...illust} size="sm" />
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
        <div className="mb-8 text-center">
          <p className="text-sm font-medium tracking-widest text-muted-foreground">
            ✦ イラスト図鑑 ✦
          </p>
        </div>

        {/* Horizontal scroll on mobile, centered wrap on desktop */}
        <div className="flex items-end gap-6 overflow-x-auto pb-4 md:flex-wrap md:justify-center md:gap-8 md:overflow-visible">
          {ILLUSTS.map((illust) => (
            <IllustCard key={illust.src} {...illust} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

const CHARS_DEF = [
  {
    id: "ishijin",
    src: "/images/石人2.png",
    alt: "石人",
    size: 80,
    name: "石人",
    description:
      "チブサン古墳に描かれた石人。古代の人々の祈りと文化を今に伝える、山鹿が誇る装飾古墳のシンボル的存在です。",
  },
  {
    id: "chibusan",
    src: "/images/チブサン_宇宙人.png",
    alt: "チブサン宇宙人",
    size: 72,
    name: "チブサン古墳 壁画",
    description:
      "山鹿市にある国指定史跡・チブサン古墳の装飾壁画。その謎めいた文様は「宇宙人」とも呼ばれ、古代ロマンを感じさせます。",
  },
  {
    id: "saruta",
    src: "/images/猿田彦.png",
    alt: "猿田彦",
    size: 88,
    name: "猿田彦大神",
    description:
      "道案内の神・猿田彦大神。旅人を正しい道へと導くとされる守護神で、山鹿の神社で今も人々に親しまれています。",
  },
];

interface CharState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  flip: boolean;
  phase: number;
  size: number;
  speedBoostUntil: number;
}

interface PopupInfo {
  index: number;
  x: number;
  y: number;
}

export function FloatingCharacters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CharState[]>([]);
  const animRef = useRef<number>(0);
  const initialized = useRef(false);
  const clickTimers = useRef<(ReturnType<typeof setTimeout> | null)[]>([null, null, null]);
  const [popup, setPopup] = useState<PopupInfo | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const w = window.innerWidth;
    const h = window.innerHeight;

    stateRef.current = CHARS_DEF.map((c, i) => ({
      x: (w / (CHARS_DEF.length + 1)) * (i + 1) - c.size / 2,
      y: h * 0.25 + Math.random() * h * 0.5,
      vx: (0.5 + Math.random() * 0.5) * (i % 2 === 0 ? 1 : -1),
      vy: (0.15 + Math.random() * 0.25) * (Math.random() > 0.5 ? 1 : -1),
      flip: i % 2 !== 0,
      phase: (i * Math.PI * 2) / CHARS_DEF.length,
      size: c.size,
      speedBoostUntil: 0,
    }));

    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const container = containerRef.current;
      const now = Date.now();

      stateRef.current = stateRef.current.map((s, i) => {
        let { x, y, vx, vy, flip, phase, size, speedBoostUntil } = s;
        const isBoosted = now < speedBoostUntil;
        const speed = isBoosted ? 4 : 1;

        phase += 0.035;
        x += vx * speed;
        y += vy * speed + Math.sin(phase) * 0.5;

        if (x <= 0) { x = 0; vx = Math.abs(vx); flip = false; }
        if (x >= vw - size) { x = vw - size; vx = -Math.abs(vx); flip = true; }
        if (y <= 68) { y = 68; vy = Math.abs(vy); }
        if (y >= vh - size - 16) { y = vh - size - 16; vy = -Math.abs(vy); }

        if (container) {
          const el = container.children[i] as HTMLElement;
          if (el) {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.transform = flip ? "scaleX(-1)" : "scaleX(1)";
            // Glow effect while boosted
            el.style.filter = isBoosted
              ? "brightness(1.4) saturate(1.6) drop-shadow(0 0 8px rgba(255,200,50,0.8))"
              : "drop-shadow(1px 2px 3px rgba(0,0,0,0.3))";
          }
        }

        return { x, y, vx, vy, flip, phase, size, speedBoostUntil };
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      initialized.current = false;
    };
  }, []);

  const handleClick = useCallback((index: number) => {
    if (clickTimers.current[index] !== null) {
      // Double click detected — clear single-click timer, show popup
      clearTimeout(clickTimers.current[index]!);
      clickTimers.current[index] = null;
      const s = stateRef.current[index];
      setPopup({ index, x: s.x, y: s.y });
    } else {
      // Wait 260ms to distinguish from double click
      clickTimers.current[index] = setTimeout(() => {
        clickTimers.current[index] = null;
        // Single click confirmed — 3-second speed boost
        stateRef.current[index].speedBoostUntil = Date.now() + 3000;
      }, 260);
    }
  }, []);

  return (
    <>
      {/* Floating characters container */}
      <div
        ref={containerRef}
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
        aria-hidden="true"
      >
        {CHARS_DEF.map((char, i) => (
          <div
            key={char.id}
            className="absolute cursor-pointer select-none transition-none"
            style={{ left: 0, top: 0, width: char.size, height: char.size, pointerEvents: "auto" }}
            onClick={() => handleClick(i)}
            title={`クリック: スピードアップ｜ダブルクリック: ${char.name}について`}
          >
            <Image
              src={char.src}
              alt={char.alt}
              width={char.size}
              height={char.size}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Info popup (double click) */}
      {popup !== null && (() => {
        const char = CHARS_DEF[popup.index];
        const popupW = 280;
        const px = Math.min(popup.x + char.size + 8, window.innerWidth - popupW - 12);
        const py = Math.max(popup.y, 80);
        return (
          <div
            className="fixed z-50 w-[280px] rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            style={{ left: px, top: py }}
          >
            {/* Close */}
            <button
              onClick={() => setPopup(null)}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground text-sm leading-none"
            >
              ✕
            </button>

            {/* Character image + name */}
            <div className="mb-3 flex items-center gap-3">
              <Image
                src={char.src}
                alt={char.name}
                width={52}
                height={52}
                className="shrink-0 object-contain"
              />
              <h3 className="font-bold text-foreground leading-tight">{char.name}</h3>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">{char.description}</p>
          </div>
        );
      })()}
    </>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// The 3 mascot characters that wander the page
const CHARS = [
  { id: "ishijin", src: "/images/石人2.png", alt: "石人", size: 80 },
  { id: "chibusan", src: "/images/チブサン_宇宙人.png", alt: "チブサン宇宙人", size: 72 },
  { id: "saruta", src: "/images/猿田彦.png", alt: "猿田彦", size: 88 },
];

interface CharState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  flip: boolean;
  phase: number;
  size: number;
}

export function FloatingCharacters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CharState[]>([]);
  const animRef = useRef<number>(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Spread characters across the viewport initially
    stateRef.current = CHARS.map((c, i) => ({
      x: (w / (CHARS.length + 1)) * (i + 1) - c.size / 2,
      y: h * 0.25 + Math.random() * h * 0.5,
      vx: (0.5 + Math.random() * 0.5) * (i % 2 === 0 ? 1 : -1),
      vy: (0.15 + Math.random() * 0.25) * (Math.random() > 0.5 ? 1 : -1),
      flip: i % 2 !== 0,
      phase: (i * Math.PI * 2) / CHARS.length,
      size: c.size,
    }));

    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const container = containerRef.current;

      stateRef.current = stateRef.current.map((s, i) => {
        let { x, y, vx, vy, flip, phase, size } = s;

        // Sine wave bobbing
        phase += 0.035;
        x += vx;
        y += vy + Math.sin(phase) * 0.5;

        // Bounce off edges — flip horizontally when bouncing left/right
        if (x <= 0) { x = 0; vx = Math.abs(vx); flip = false; }
        if (x >= vw - size) { x = vw - size; vx = -Math.abs(vx); flip = true; }
        // Keep below sticky header (~68px) and above bottom
        if (y <= 68) { y = 68; vy = Math.abs(vy); }
        if (y >= vh - size - 16) { y = vh - size - 16; vy = -Math.abs(vy); }

        // Direct DOM update — no React re-render needed
        if (container) {
          const el = container.children[i] as HTMLElement;
          if (el) {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.transform = flip ? "scaleX(-1)" : "scaleX(1)";
          }
        }

        return { x, y, vx, vy, flip, phase, size };
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      initialized.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      {CHARS.map((char) => (
        <div
          key={char.id}
          className="absolute"
          style={{ left: 0, top: 0, width: char.size, height: char.size }}
        >
          <Image
            src={char.src}
            alt={char.alt}
            width={char.size}
            height={char.size}
            className="object-contain drop-shadow-md"
          />
        </div>
      ))}
    </div>
  );
}

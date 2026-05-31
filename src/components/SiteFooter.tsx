"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Instagram } from "lucide-react";
import { getSiteContent } from "@/lib/firestore";
import type { SiteContentSettings } from "@/types/admin";

export function SiteFooter() {
  const [handle, setHandle] = useState("ekirei_219");

  useEffect(() => {
    getSiteContent<SiteContentSettings>("settings").then((data) => {
      if (data?.instagramHandle) setHandle(data.instagramHandle);
    });
  }, []);

  return (
    <footer style={{ background: "#1C2E22" }}>
      <div className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="EKIREI" width={40} height={40}
                className="h-10 w-auto object-contain" />
              <span className="text-xl font-bold tracking-widest text-white">EKIREI</span>
            </div>

            <p className="max-w-xs text-sm text-white/60">
              厳選したスペシャルティコーヒーを、毎日の一杯に。
            </p>

            <div className="flex items-center gap-2">
              {(["var(--brand-green)", "var(--pop-rose)", "var(--pop-ochre)", "var(--brand-purple)"] as const).map(
                (color, i) => (
                  <div key={i} className="h-2 w-2 rounded-full" style={{ background: color }} />
                )
              )}
            </div>

            <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
              aria-label="Instagram">
              <Instagram size={16} />
              @{handle}
            </a>
          </div>

          <Separator className="mb-8 bg-white/10" />

          <div className="flex flex-col items-center gap-2 text-center text-xs text-white/40">
            <nav className="flex gap-6">
              <a href="#products" className="transition-colors hover:text-white/80">商品</a>
              <a href="#story" className="transition-colors hover:text-white/80">ブランドについて</a>
              <a href="#contact" className="transition-colors hover:text-white/80">お問い合わせ</a>
            </nav>
            <p className="mt-2">© 2025 EKIREI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

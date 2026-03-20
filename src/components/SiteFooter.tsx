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
    <footer className="border-t bg-card px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Image
            src="/images/logo.png"
            alt="EKIREI"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <p className="max-w-xs text-sm text-muted-foreground">
            厳選したスペシャルティコーヒーを、毎日の一杯に。
          </p>
          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            aria-label="Instagram"
          >
            <Instagram size={16} />
            @{handle}
          </a>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
          <nav className="flex gap-6">
            <a href="#products" className="hover:text-foreground transition-colors">商品</a>
            <a href="#story" className="hover:text-foreground transition-colors">ブランドについて</a>
            <a href="#contact" className="hover:text-foreground transition-colors">お問い合わせ</a>
          </nav>
          <p className="mt-2">© 2025 EKIREI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

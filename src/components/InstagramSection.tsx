"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram } from "lucide-react";
import type { InstagramPost } from "@/app/api/instagram/route";

export function InstagramSection() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="instagram" className="bg-muted/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary">INSTAGRAM</p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            日々のコーヒーを
            <br className="sm:hidden" />
            シェアしています
          </h2>
          <p className="text-muted-foreground">
            豆の産地、焙煎の様子、おすすめのドリップ方法など。
          </p>
        </div>

        {/* Photo row — 3 posts, 1 row, responsive sizing */}
        <div className="mb-10 flex justify-center gap-3 sm:gap-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-square w-[28vw] max-w-[200px] rounded-2xl" />
            ))
          ) : posts.length === 0 ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square w-[28vw] max-w-[200px] shrink-0 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center"
              >
                <Instagram size={20} className="text-stone-400" />
              </div>
            ))
          ) : (
            posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square w-[28vw] max-w-[200px] shrink-0 overflow-hidden rounded-2xl"
                aria-label={post.caption || "Instagram投稿"}
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || "Instagram投稿"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 28vw, 200px"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 transition-colors group-hover:bg-black/25">
                  <Instagram
                    size={20}
                    className="text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100"
                  />
                </div>
              </a>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://instagram.com/ekirei_219"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
              <Instagram size={16} />
              @ekirei_219 をフォロー
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

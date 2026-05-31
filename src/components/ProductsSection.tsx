"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/lib/firestore";
import type { ProductDoc } from "@/types/admin";
import Link from "next/link";
import { IllustImg } from "@/components/IllustImg";

const ILLUST_MAP: { key: string; name: string; bg: string }[] = [
  { key: "さくら湯",   name: "さくら湯",       bg: "#3A5A80" },
  { key: "アイラ",     name: "アイラトビカズラ", bg: "#5A3020" },
  { key: "トビカズラ", name: "アイラトビカズラ", bg: "#5A3020" },
  { key: "チブサン",   name: "チブサン",         bg: "#B06070" },
  { key: "不動岩",     name: "不動岩",           bg: "#3A5C3A" },
  { key: "猿田彦",     name: "猿田彦",           bg: "#2A2420" },
];

function getIllust(name: string) {
  return ILLUST_MAP.find((m) => name.includes(m.key)) ?? null;
}

function ProductIllust({ productName }: { productName: string }) {
  const illust = getIllust(productName);
  if (!illust) return null;
  return (
    <div className="flex h-full w-full items-center justify-center p-3" style={{ background: illust.bg }}>
      <IllustImg name={illust.name} alt={productName} className="h-28 w-auto" />
    </div>
  );
}

function ProductCard({ product }: { product: ProductDoc }) {
  const hasPhoto = !!product.imageUrl;
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group relative overflow-hidden rounded-3xl bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Image area */}
        <div className="relative h-48 w-full overflow-hidden">
          {hasPhoto ? (
            <Image
              src={product.imageUrl!}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              quality={90}
            />
          ) : (
            <ProductIllust productName={product.name} />
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="mb-1 font-bold text-foreground">{product.name}</h3>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {product.flavor.map((f) => (
              <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              ¥{product.price.toLocaleString("ja-JP")}
              <span className="text-xs font-normal text-muted-foreground"> /個</span>
            </span>
            <Button size="sm" className="text-white" style={{ background: "var(--brand-green)" }} asChild>
              <span>詳細を見る</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductsSection() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.filter((p) => p.active)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="products" className="relative overflow-hidden pb-24 pt-20">
      {/* 不動岩 landscape: large decorative placement, not stretched */}
      <div
        className="pointer-events-none absolute right-0 top-0 -z-0 h-full w-1/2 overflow-hidden opacity-[0.08] md:opacity-[0.12]"
        style={{ mixBlendMode: "multiply" }}
      >
        <Image
          src="/images/不動岩.svg"
          alt=""
          fill
          className="object-contain object-right-top"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/不動岩.png";
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section header — bold, left-aligned, editorial */}
        <div className="mb-14 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-sm font-bold tracking-[0.25em]" style={{ color: "var(--pop-rose)" }}>
              ✦ LINEUP
            </p>
            <h2 className="text-4xl font-black leading-none tracking-tight text-foreground md:text-6xl">
              商品
            </h2>
            <p className="mt-1 text-lg text-muted-foreground">ラインナップ</p>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            地域の名所や自然からインスパイアされた、EKIREIオリジナルのドリップバッグコーヒー。
          </p>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-3xl bg-card shadow-md">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="flex flex-col gap-2 p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">準備中です。もうしばらくお待ちください。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            まとめ買いや贈り物のご相談は
            <a href="#contact" className="ml-1 text-primary underline underline-offset-4">お問い合わせ</a>
            ください
          </p>
        </div>
      </div>
    </section>
  );
}

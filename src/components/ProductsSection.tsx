"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/lib/firestore";
import type { ProductDoc } from "@/types/admin";
import { Coffee } from "lucide-react";
import Link from "next/link";

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={90}
        />
      </div>
    );
  }
  return (
    <div className="flex h-48 items-center justify-center" style={{ background: "var(--pop-cream)" }}>
      <Coffee size={36} className="text-muted-foreground/40" />
    </div>
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
    <section id="products" className="pb-24">
      {/* 不動岩 landscape — full-width section header banner */}
      <div className="relative h-56 w-full overflow-hidden md:h-72">
        <Image
          src="/images/不動岩.png"
          alt="不動岩"
          fill
          className="object-cover object-center"
          quality={95}
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <p className="text-xs font-bold tracking-[0.3em] opacity-90">✦ LINEUP ✦</p>
          <h2 className="text-3xl font-bold drop-shadow md:text-4xl">商品ラインナップ</h2>
          <p className="text-sm opacity-80">地域の名所からインスパイアされたEKIREIオリジナルコーヒー</p>
        </div>
      </div>

      {/* Products grid */}
      <div className="mx-auto max-w-6xl px-6 pt-16">
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="flex flex-col gap-2 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">準備中です。もうしばらくお待ちください。</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group h-full cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
                  <ProductImage src={product.imageUrl} alt={product.name} />
                  <CardHeader className="pb-2">
                    <h3 className="font-bold text-foreground">{product.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1.5">
                      {product.flavor.map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                      ¥{product.price.toLocaleString("ja-JP")}
                      <span className="text-xs font-normal text-muted-foreground"> /個（税抜）</span>
                    </span>
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5" asChild>
                      <span>詳細を見る</span>
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
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

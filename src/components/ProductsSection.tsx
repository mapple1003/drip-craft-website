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
        />
      </div>
    );
  }
  return (
    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 shadow-sm backdrop-blur-sm">
        <Coffee size={36} className="text-stone-600" />
      </div>
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

  const singles = products.slice(0, -1).concat(
    products.length > 0 ? [] : []
  );
  // Show all active products as individual cards, then check if there's a set in Firestore
  // For now show all products as individual cards

  return (
    <section id="products" className="bg-muted/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary">LINEUP</p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            商品ラインナップ
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            地域の名所や自然からインスパイアされた、
            EKIREIオリジナルのドリップバッグコーヒーです。
          </p>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4 flex flex-col gap-2">
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
                      <span className="text-xs font-normal text-muted-foreground"> /個</span>
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

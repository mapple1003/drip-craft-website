"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Coffee, Globe } from "lucide-react";
import { getProduct } from "@/lib/firestore";
import type { ProductDoc } from "@/types/admin";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        if (!data || !data.active) router.replace("/");
        else setProduct(data);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Skeleton className="mb-8 h-6 w-24" />
        <div className="grid gap-12 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-widest text-primary">
            EKIREI
          </Link>
          {product.nameEn && (
            <Link href={`/en/products/${id}`}>
              <Button variant="outline" size="sm" className="gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
                <Globe size={14} />
                English
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          一覧に戻る
        </button>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 400px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Coffee size={64} className="text-stone-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-sm font-medium tracking-widest text-primary">EKIREI ORIGINAL</p>
              <h1 className="mb-3 text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
            </div>

            {/* Flavor */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">フレーバー</p>
              <div className="flex flex-wrap gap-2">
                {product.flavor.map((f) => (
                  <Badge key={f} variant="secondary" className="px-3 py-1 text-sm">{f}</Badge>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">価格</p>
              <p className="text-3xl font-bold text-foreground">
                ¥{product.price.toLocaleString("ja-JP")}
                <span className="text-sm font-normal text-muted-foreground"> （税抜）</span>
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <a href="#contact" onClick={() => router.push("/#contact")}>
                <Button className="w-full" size="lg">購入・お問い合わせ</Button>
              </a>
              <Link href="/">
                <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/5" size="lg">
                  他の商品を見る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

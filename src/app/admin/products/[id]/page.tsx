"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProductDoc } from "@/types/admin";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Timestamp } from "firebase/firestore";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, "products", id)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProduct({
          id: snap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
        } as ProductDoc);
      }
      setLoading(false);
    });
  }, [id]);

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4 text-muted-foreground">
              <Link href="/admin/products"><ChevronLeft size={16} />商品一覧に戻る</Link>
            </Button>
            <h1 className="text-2xl font-bold">商品を編集</h1>
          </div>
          <div className="max-w-2xl">
            {loading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : product ? (
              <ProductForm product={product} />
            ) : (
              <p className="text-muted-foreground">商品が見つかりませんでした</p>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

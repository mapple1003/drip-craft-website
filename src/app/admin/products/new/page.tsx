"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4 text-muted-foreground">
              <Link href="/admin/products"><ChevronLeft size={16} />商品一覧に戻る</Link>
            </Button>
            <h1 className="text-2xl font-bold">商品を追加</h1>
          </div>
          <div className="max-w-2xl">
            <ProductForm />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

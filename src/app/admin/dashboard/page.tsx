"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, getContacts } from "@/lib/firestore";
import { Package, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [contactCount, setContactCount] = useState<number | null>(null);

  useEffect(() => {
    getProducts().then((p) => setProductCount(p.length));
    getContacts().then((c) => setContactCount(c.length));
  }, []);

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">ダッシュボード</h1>
            <p className="text-muted-foreground">EKIREIサイトの管理</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">商品数</CardTitle>
                <Package size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{productCount ?? "..."}</p>
                <Link href="/admin/products" className="text-xs text-primary hover:underline">
                  商品を管理する →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">お問い合わせ</CardTitle>
                <Mail size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{contactCount ?? "..."}</p>
                <Link href="/admin/contacts" className="text-xs text-primary hover:underline">
                  一覧を見る →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">クイックリンク</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href="https://drip-craft-website.vercel.app" target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} className="mr-2" />
                  サイトを表示
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products">商品を追加</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/content">文章を編集</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminGuard>
  );
}

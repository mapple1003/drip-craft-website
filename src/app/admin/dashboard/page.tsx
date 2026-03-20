"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, getContacts, createProduct } from "@/lib/firestore";
import { Package, Mail, ExternalLink, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

// Initial product data to seed into Firestore
const INITIAL_PRODUCTS = [
  {
    name: "チブサンブレンド",
    description: "EKIREIオリジナルブレンド。豊かなコクと穏やかな香りが広がる、毎日飲みたくなる一杯。",
    flavor: ["まろやか", "コク", "バランス"],
    price: 500,
    imageUrl: "/images/product-chibusanblend.png",
    order: 0,
    active: true,
  },
  {
    name: "不動岩ブレンド",
    description: "力強い風味と深みのある味わい。ゆっくりと流れる時間を楽しみたい日の一杯に。",
    flavor: ["力強い", "深み", "ビター"],
    price: 500,
    imageUrl: "/images/product-fudoiwa.png",
    order: 1,
    active: true,
  },
  {
    name: "アイラトビカズラブレンド",
    description: "華やかな香りと柔らかな甘さが特徴。特別な朝にふさわしい、上品な味わい。",
    flavor: ["華やか", "甘み", "フローラル"],
    price: 500,
    imageUrl: "/images/product-aira-tobikatura.png",
    order: 2,
    active: true,
  },
  {
    name: "さくら湯ブレンド",
    description: "やさしい口当たりとほのかな甘み。春のような穏やかさを感じるすっきりとした一杯。",
    flavor: ["やさしい", "すっきり", "ほんのり甘い"],
    price: 500,
    imageUrl: "/images/product-sakurayu.png",
    order: 3,
    active: true,
  },
  {
    name: "４種セット",
    description: "チブサンブレンド・不動岩ブレンド・アイラトビカズラブレンド・さくら湯ブレンドを各1袋ずつ。はじめての方やギフトに最適。",
    flavor: ["ギフト", "お試し", "4種類"],
    price: 1800,
    imageUrl: "/images/product-set.png",
    order: 4,
    active: true,
  },
];

export default function DashboardPage() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [contactCount, setContactCount] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = () => {
    getProducts().then((p) => setProductCount(p.length));
    getContacts().then((c) => setContactCount(c.length));
  };

  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    if (!confirm("現在の商品データ（4商品＋セット）を Firestore に登録します。よろしいですか？")) return;
    setSeeding(true);
    try {
      for (const product of INITIAL_PRODUCTS) {
        await createProduct(product);
      }
      toast.success("商品データを登録しました！");
      load();
    } catch {
      toast.error("登録に失敗しました");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">ダッシュボード</h1>
            <p className="text-muted-foreground">EKIREIサイトの管理</p>
          </div>

          {/* Seed banner — shown only when no products */}
          {productCount === 0 && (
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-foreground">商品がまだ登録されていません</p>
                  <p className="text-sm text-muted-foreground">
                    現在の4商品＋セットを一括で登録できます
                  </p>
                </div>
                <Button onClick={handleSeed} disabled={seeding} className="shrink-0">
                  {seeding ? (
                    <><Loader2 size={16} className="animate-spin mr-2" />登録中...</>
                  ) : (
                    <><Download size={16} className="mr-2" />初期データを登録</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

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

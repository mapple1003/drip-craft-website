"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSpots, deleteSpot } from "@/lib/firestore";
import { getAllSpotStats } from "@/lib/stats";
import type { SpotDoc } from "@/types/admin";
import type { SpotStats } from "@/lib/stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, QrCode, ExternalLink, Smartphone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function SpotsPage() {
  const [spots, setSpots] = useState<SpotDoc[]>([]);
  const [stats, setStats] = useState<Record<string, SpotStats>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [spotsData, statsData] = await Promise.all([
      getSpots(),
      getAllSpotStats(),
    ]);
    setSpots(spotsData);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (spot: SpotDoc) => {
    if (!confirm(`「${spot.name}」を削除しますか？`)) return;
    try {
      await deleteSpot(spot.id);
      toast.success("削除しました");
      load();
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  const origin = "https://www.ekirei219.com";

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">名所ページ管理</h1>
              <p className="text-muted-foreground">QRコード用の名所説明ページを管理</p>
            </div>
            <Link href="/admin/spots/new">
              <Button><Plus size={16} className="mr-2" />名所を追加</Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-muted-foreground">読み込み中...</p>
          ) : spots.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <QrCode size={40} className="text-muted-foreground" />
                <div>
                  <p className="font-semibold">名所がまだ登録されていません</p>
                  <p className="text-sm text-muted-foreground">「名所を追加」から登録してください</p>
                </div>
                <Link href="/admin/spots/new">
                  <Button>名所を追加</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {spots.map((spot) => {
                const url = `${origin}/spots/${spot.id}?scan=1`;
                const s = stats[spot.id] ?? { scanCount: 0, visitCount: 0 };
                const langs = [
                  spot.nameEn && "EN",
                  spot.nameZh && "ZH",
                  spot.nameKo && "KO",
                ].filter(Boolean);
                return (
                  <Card key={spot.id}>
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground truncate">{spot.name}</p>
                          {!spot.active && <Badge variant="secondary">非公開</Badge>}
                          {spot.isIntro && <Badge variant="outline" className="text-xs border-[#693c85]/40 text-[#693c85]">📖 紹介</Badge>}
                          {langs.map((l) => (
                            <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{spot.description}</p>

                        {/* Stats */}
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#693c85" }}>
                            <Smartphone size={12} />
                            <span>スキャン {s.scanCount}回</span>
                          </div>
                          {spot.lat && spot.lng && (
                            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#539d84" }}>
                              <MapPin size={12} />
                              <span>訪問 {s.visitCount}回</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <QrCode size={12} />
                          <span className="truncate font-mono">{url}</span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary hover:underline">
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link href={`/admin/spots/${spot.id}`}>
                          <Button variant="outline" size="sm"><Pencil size={14} /></Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(spot)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { getStores, deleteStore } from "@/lib/firestore";
import type { StoreDoc } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, MapPin, Store } from "lucide-react";
import { toast } from "sonner";

export default function StoresPage() {
  const [stores, setStores] = useState<StoreDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getStores().then(setStores).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (store: StoreDoc) => {
    if (!confirm(`「${store.name}」を削除しますか？`)) return;
    try {
      await deleteStore(store.id);
      toast.success("削除しました");
      load();
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">取扱店舗</h1>
              <p className="text-muted-foreground">EKIREIを取り扱う店舗を管理</p>
            </div>
            <Link href="/admin/stores/new">
              <Button><Plus size={16} className="mr-2" />店舗を追加</Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-muted-foreground">読み込み中...</p>
          ) : stores.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <Store size={40} className="text-muted-foreground" />
                <div>
                  <p className="font-semibold">店舗がまだ登録されていません</p>
                  <p className="text-sm text-muted-foreground">「店舗を追加」から登録してください</p>
                </div>
                <Link href="/admin/stores/new">
                  <Button>店舗を追加</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {stores.map((store) => (
                <Card key={store.id}>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="font-semibold text-foreground">{store.name}</p>
                        {!store.active && <Badge variant="secondary">非公開</Badge>}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin size={13} className="text-primary/60" />
                        <span>{store.address}</span>
                      </div>
                      {store.note && <p className="mt-0.5 text-xs text-muted-foreground">{store.note}</p>}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link href={`/admin/stores/${store.id}`}>
                        <Button variant="outline" size="sm"><Pencil size={14} /></Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(store)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}

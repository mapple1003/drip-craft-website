"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { StoreForm } from "@/components/admin/StoreForm";
import { getStores } from "@/lib/firestore";
import type { StoreDoc } from "@/types/admin";

export default function EditStorePage() {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreDoc | null>(null);

  useEffect(() => {
    getStores().then((stores) => {
      setStore(stores.find((s) => s.id === id) ?? null);
    });
  }, [id]);

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">店舗を編集</h1>
            <p className="text-muted-foreground">{store?.name ?? "読み込み中..."}</p>
          </div>
          <div className="max-w-xl">
            {store && <StoreForm store={store} />}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

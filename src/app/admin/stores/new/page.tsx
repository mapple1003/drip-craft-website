"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { StoreForm } from "@/components/admin/StoreForm";

export default function NewStorePage() {
  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">店舗を追加</h1>
            <p className="text-muted-foreground">取扱店舗を新規登録</p>
          </div>
          <div className="max-w-xl">
            <StoreForm />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

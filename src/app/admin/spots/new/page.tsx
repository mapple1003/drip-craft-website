"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { SpotForm } from "@/components/admin/SpotForm";

export default function NewSpotPage() {
  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">名所を追加</h1>
            <p className="text-muted-foreground">QRコード用の名所説明ページを作成</p>
          </div>
          <div className="max-w-2xl">
            <SpotForm />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { SpotForm } from "@/components/admin/SpotForm";
import { getSpot } from "@/lib/firestore";
import type { SpotDoc } from "@/types/admin";

export default function EditSpotPage() {
  const { id } = useParams<{ id: string }>();
  const [spot, setSpot] = useState<SpotDoc | null>(null);

  useEffect(() => {
    getSpot(id).then(setSpot);
  }, [id]);

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">名所を編集</h1>
            <p className="text-muted-foreground">{spot?.name ?? "読み込み中..."}</p>
          </div>
          <div className="max-w-2xl">
            {spot && <SpotForm spot={spot} />}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

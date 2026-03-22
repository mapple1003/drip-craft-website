"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { EventForm } from "@/components/admin/EventForm";
import { getEvent } from "@/lib/firestore";
import type { EventDoc } from "@/types/admin";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDoc | null>(null);

  useEffect(() => {
    getEvent(id).then(setEvent);
  }, [id]);

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">イベントを編集</h1>
            <p className="text-muted-foreground">{event?.title ?? "読み込み中..."}</p>
          </div>
          <div className="max-w-2xl">
            {event && <EventForm event={event} />}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

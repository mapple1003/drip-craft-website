"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { getEvents, deleteEvent } from "@/lib/firestore";
import type { EventDoc } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getEvents().then(setEvents).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (event: EventDoc) => {
    if (!confirm(`「${event.title}」を削除しますか？`)) return;
    try {
      await deleteEvent(event.id);
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
              <h1 className="text-2xl font-bold">イベント情報</h1>
              <p className="text-muted-foreground">イベント・出店情報を管理</p>
            </div>
            <Link href="/admin/events/new">
              <Button><Plus size={16} className="mr-2" />新規追加</Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-muted-foreground">読み込み中...</p>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <CalendarDays size={40} className="text-muted-foreground" />
                <div>
                  <p className="font-semibold">イベントがまだ登録されていません</p>
                  <p className="text-sm text-muted-foreground">「新規追加」から登録してください</p>
                </div>
                <Link href="/admin/events/new">
                  <Button>新規追加</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="font-semibold text-foreground">{event.title}</p>
                        {!event.active && <Badge variant="secondary">非公開</Badge>}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays size={13} className="text-primary/60" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin size={13} className="text-primary/60" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link href={`/admin/events/${event.id}`}>
                        <Button variant="outline" size="sm"><Pencil size={14} /></Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(event)}>
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

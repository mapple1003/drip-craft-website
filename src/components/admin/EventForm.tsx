"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createEvent, updateEvent } from "@/lib/firestore";
import type { EventDoc } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(1, "入力してください"),
  date: z.string().min(1, "入力してください"),
  location: z.string().min(1, "入力してください"),
  address: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  order: z.string(),
  active: z.boolean(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function EventForm({ event }: { event?: EventDoc }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isEdit = !!event;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title ?? "",
      date: event?.date ?? "",
      location: event?.location ?? "",
      address: event?.address ?? "",
      description: event?.description ?? "",
      url: event?.url ?? "",
      order: String(event?.order ?? 0),
      active: event?.active ?? true,
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    setIsPending(true);
    try {
      const payload = {
        title: data.title,
        date: data.date,
        location: data.location,
        address: data.address ?? "",
        description: data.description ?? "",
        url: data.url ?? "",
        order: Number(data.order),
        active: data.active,
      };
      if (isEdit) {
        await updateEvent(event.id, payload);
        toast.success("イベントを更新しました");
      } else {
        await createEvent(payload);
        toast.success("イベントを追加しました");
      }
      router.push("/admin/events");
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>イベント名</FormLabel>
                <FormControl><Input placeholder="例：マルシェ出店" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem>
                <FormLabel>日時</FormLabel>
                <FormControl><Input placeholder="例：2025年4月5日（土）13:00〜17:00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem>
                <FormLabel>会場名</FormLabel>
                <FormControl><Input placeholder="例：〇〇広場" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>住所（任意）</FormLabel>
                <FormControl><Input placeholder="例：熊本県熊本市中央区〇〇町1-1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>詳細・備考（任意）</FormLabel>
                <FormControl><Textarea placeholder="イベントの詳細や備考を入力してください" rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="url" render={({ field }) => (
              <FormItem>
                <FormLabel>関連URL（任意）</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <p className="text-xs text-muted-foreground">SNSやイベントページのURLを入力すると「詳細を見る」リンクが表示されます</p>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="order" render={({ field }) => (
              <FormItem>
                <FormLabel>表示順（小さい順）</FormLabel>
                <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="active" render={({ field }) => (
              <FormItem>
                <FormLabel>公開設定</FormLabel>
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(v) => field.onChange(v === "true")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">公開</SelectItem>
                    <SelectItem value="false">非公開</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? <><Loader2 size={16} className="animate-spin mr-2" />保存中...</> : isEdit ? "更新する" : "追加する"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
                キャンセル
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createStore, updateStore } from "@/lib/firestore";
import type { StoreDoc } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const storeSchema = z.object({
  name: z.string().min(1, "入力してください"),
  address: z.string().min(1, "入力してください"),
  url: z.string().optional(),
  note: z.string().optional(),
  order: z.string(),
  active: z.boolean(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export function StoreForm({ store }: { store?: StoreDoc }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isEdit = !!store;

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store?.name ?? "",
      address: store?.address ?? "",
      url: store?.url ?? "",
      note: store?.note ?? "",
      order: String(store?.order ?? 0),
      active: store?.active ?? true,
    },
  });

  const onSubmit = async (data: StoreFormValues) => {
    setIsPending(true);
    try {
      const payload = {
        name: data.name,
        address: data.address,
        url: data.url ?? "",
        note: data.note ?? "",
        order: Number(data.order),
        active: data.active,
      };
      if (isEdit) {
        await updateStore(store.id, payload);
        toast.success("店舗を更新しました");
      } else {
        await createStore(payload);
        toast.success("店舗を追加しました");
      }
      router.push("/admin/stores");
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
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>店舗名</FormLabel>
                <FormControl><Input placeholder="例：〇〇カフェ" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>住所</FormLabel>
                <FormControl><Input placeholder="例：熊本県熊本市中央区〇〇町1-1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="url" render={({ field }) => (
              <FormItem>
                <FormLabel>店舗URL（任意）</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <p className="text-xs text-muted-foreground">SNSや公式サイトのURLを入力するとリンクが表示されます</p>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="note" render={({ field }) => (
              <FormItem>
                <FormLabel>備考（任意）</FormLabel>
                <FormControl><Input placeholder="例：土日限定、イベント出店中" {...field} /></FormControl>
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
            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? <><Loader2 size={16} className="animate-spin mr-2" />保存中...</> : isEdit ? "更新する" : "追加する"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/stores")}>
                キャンセル
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

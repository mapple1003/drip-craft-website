"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createSpot, updateSpot } from "@/lib/firestore";
import type { SpotDoc } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles } from "lucide-react";

const spotSchema = z.object({
  name: z.string().min(1, "入力してください"),
  description: z.string().min(1, "入力してください"),
  nameEn: z.string().optional(),
  descriptionEn: z.string().optional(),
  nameZh: z.string().optional(),
  descriptionZh: z.string().optional(),
  nameKo: z.string().optional(),
  descriptionKo: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.string(),
  active: z.boolean(),
});

type SpotFormValues = z.infer<typeof spotSchema>;

type StringField = "nameEn" | "descriptionEn" | "nameZh" | "descriptionZh" | "nameKo" | "descriptionKo";

const LANG_FIELDS: { lang: string; flag: string; nameKey: StringField; descKey: StringField }[] = [
  { lang: "English", flag: "🇺🇸", nameKey: "nameEn", descKey: "descriptionEn" },
  { lang: "中文（Chinese）", flag: "🇨🇳", nameKey: "nameZh", descKey: "descriptionZh" },
  { lang: "한국어（Korean）", flag: "🇰🇷", nameKey: "nameKo", descKey: "descriptionKo" },
];

export function SpotForm({ spot }: { spot?: SpotDoc }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [translating, setTranslating] = useState(false);
  const isEdit = !!spot;

  const form = useForm<SpotFormValues>({
    resolver: zodResolver(spotSchema),
    defaultValues: {
      name: spot?.name ?? "",
      description: spot?.description ?? "",
      nameEn: spot?.nameEn ?? "",
      descriptionEn: spot?.descriptionEn ?? "",
      nameZh: spot?.nameZh ?? "",
      descriptionZh: spot?.descriptionZh ?? "",
      nameKo: spot?.nameKo ?? "",
      descriptionKo: spot?.descriptionKo ?? "",
      imageUrl: spot?.imageUrl ?? "",
      order: String(spot?.order ?? 0),
      active: spot?.active ?? true,
    },
  });

  const handleAutoTranslate = async () => {
    const name = form.getValues("name");
    const description = form.getValues("description");
    if (!name && !description) {
      toast.error("先に日本語の名所名と説明を入力してください");
      return;
    }
    setTranslating(true);
    try {
      const [nameRes, descRes] = await Promise.all([
        name ? fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: name, targets: ["EN-US", "ZH", "KO"] }),
        }).then((r) => r.json()) : Promise.resolve({}),
        description ? fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: description, targets: ["EN-US", "ZH", "KO"] }),
        }).then((r) => r.json()) : Promise.resolve({}),
      ]);
      if (nameRes["EN-US"]) form.setValue("nameEn", nameRes["EN-US"]);
      if (nameRes["ZH"]) form.setValue("nameZh", nameRes["ZH"]);
      if (nameRes["KO"]) form.setValue("nameKo", nameRes["KO"]);
      if (descRes["EN-US"]) form.setValue("descriptionEn", descRes["EN-US"]);
      if (descRes["ZH"]) form.setValue("descriptionZh", descRes["ZH"]);
      if (descRes["KO"]) form.setValue("descriptionKo", descRes["KO"]);
      toast.success("翻訳が完了しました。内容を確認して保存してください。");
    } catch {
      toast.error("翻訳に失敗しました");
    } finally {
      setTranslating(false);
    }
  };

  const onSubmit = async (data: SpotFormValues) => {
    setIsPending(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        nameEn: data.nameEn ?? "",
        descriptionEn: data.descriptionEn ?? "",
        nameZh: data.nameZh ?? "",
        descriptionZh: data.descriptionZh ?? "",
        nameKo: data.nameKo ?? "",
        descriptionKo: data.descriptionKo ?? "",
        imageUrl: data.imageUrl ?? "",
        order: Number(data.order),
        active: data.active,
      };
      if (isEdit) {
        await updateSpot(spot.id, payload);
        toast.success("名所を更新しました");
      } else {
        await createSpot(payload);
        toast.success("名所を追加しました");
      }
      router.push("/admin/spots");
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
            {/* Japanese */}
            <p className="text-sm font-medium text-muted-foreground">🇯🇵 日本語</p>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>名所名（日本語）</FormLabel>
                <FormControl><Input placeholder="例：チブサン古墳" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>説明（日本語）</FormLabel>
                <FormControl><Textarea placeholder="名所の説明を入力..." rows={4} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Separator />

            {/* Auto translate button */}
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">自動翻訳（DeepL）</p>
                <p className="text-xs text-muted-foreground">日本語の内容を英語・中文・韓国語に一括翻訳します</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={translating}
                onClick={handleAutoTranslate}
                className="shrink-0 border-primary/30 text-primary hover:bg-primary/5"
              >
                {translating ? (
                  <><Loader2 size={14} className="animate-spin mr-1.5" />翻訳中...</>
                ) : (
                  <><Sparkles size={14} className="mr-1.5" />自動翻訳</>
                )}
              </Button>
            </div>

            {/* Foreign languages */}
            {LANG_FIELDS.map(({ lang, flag, nameKey, descKey }) => (
              <div key={lang} className="flex flex-col gap-4">
                <p className="text-sm font-medium text-muted-foreground">{flag} {lang}</p>
                <FormField control={form.control} name={nameKey} render={({ field }) => (
                  <FormItem>
                    <FormLabel>名所名</FormLabel>
                    <FormControl><Input placeholder={`${lang} name`} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={descKey} render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl><Textarea placeholder={`${lang} description`} rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Separator />
              </div>
            ))}

            {/* Settings */}
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>写真URL（任意）</FormLabel>
                <FormControl><Input placeholder="/images/spot-chibusan.jpg" {...field} /></FormControl>
                <p className="text-xs text-muted-foreground">public/images/ に画像を置いた場合は /images/ファイル名</p>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="order" render={({ field }) => (
                <FormItem>
                  <FormLabel>表示順</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? <><Loader2 size={16} className="animate-spin mr-2" />保存中...</> : isEdit ? "更新する" : "追加する"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/spots")}>
                キャンセル
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

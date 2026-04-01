"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createSpot, updateSpot } from "@/lib/firestore";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { SpotDoc } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, Plus, Trash2, Upload, MapPin } from "lucide-react";

const spotSchema = z.object({
  name: z.string().min(1, "入力してください"),
  description: z.string().min(1, "入力してください"),
  nameEn: z.string().optional(),
  descriptionEn: z.string().optional(),
  nameZh: z.string().optional(),
  descriptionZh: z.string().optional(),
  nameKo: z.string().optional(),
  descriptionKo: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  order: z.string(),
  active: z.boolean(),
  isIntro: z.boolean(),
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

  // 複数写真管理
  type ImageEntry = { url: string; caption: string };
  const normalizeUrl = (url: string) => {
    if (!url || url.startsWith("http") || url.startsWith("/")) return url;
    return `/${url}`;
  };
  const initImages = (): ImageEntry[] => {
    if (spot?.images?.length) return spot.images.map((img) => ({ url: normalizeUrl(img.url), caption: img.caption ?? "" }));
    if (spot?.imageUrls?.length) return spot.imageUrls.map((url) => ({ url: normalizeUrl(url), caption: "" }));
    if (spot?.imageUrl) return [{ url: normalizeUrl(spot.imageUrl), caption: "" }];
    return [{ url: "", caption: "" }];
  };
  const [images, setImages] = useState<ImageEntry[]>(initImages);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleFileUpload = async (file: File, index: number) => {
    setUploadingIndex(index);
    try {
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const storageRef = ref(storage, `spots/${filename}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const next = [...images];
      next[index] = { ...next[index], url };
      setImages(next);
      toast.success("アップロード完了");
    } catch {
      toast.error("アップロードに失敗しました");
    } finally {
      setUploadingIndex(null);
    }
  };

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
      lat: spot?.lat != null ? String(spot.lat) : "",
      lng: spot?.lng != null ? String(spot.lng) : "",
      order: String(spot?.order ?? 0),
      active: spot?.active ?? true,
      isIntro: spot?.isIntro ?? false,
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
      const filteredImages = images.filter((img) => img.url.trim() !== "");
      const payload = {
        name: data.name,
        description: data.description,
        nameEn: data.nameEn ?? "",
        descriptionEn: data.descriptionEn ?? "",
        nameZh: data.nameZh ?? "",
        descriptionZh: data.descriptionZh ?? "",
        nameKo: data.nameKo ?? "",
        descriptionKo: data.descriptionKo ?? "",
        imageUrl: filteredImages[0]?.url ?? "",
        imageUrls: filteredImages.map((img) => img.url),
        images: filteredImages,
        ...(data.lat ? { lat: Number(data.lat) } : {}),
        ...(data.lng ? { lng: Number(data.lng) } : {}),
        order: Number(data.order),
        active: data.active,
        isIntro: data.isIntro,
      };
      if (isEdit) {
        await updateSpot(spot.id, payload);
        toast.success("名所を更新しました");
      } else {
        await createSpot(payload);
        toast.success("名所を追加しました");
      }
      router.push("/admin/spots");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`保存に失敗しました: ${msg}`);
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <FormLabel>写真（複数可）</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setImages((prev) => [...prev, { url: "", caption: "" }])}
                >
                  <Plus size={14} className="mr-1" />写真を追加
                </Button>
              </div>
              {images.map((img, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="写真をアップロードするかURLを入力"
                        value={img.url}
                        onChange={(e) => {
                          const next = [...images];
                          next[i] = { ...next[i], url: e.target.value };
                          setImages(next);
                        }}
                        className="flex-1"
                      />
                      <label className="shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, i);
                            e.target.value = "";
                          }}
                        />
                        <Button type="button" variant="outline" size="sm" asChild disabled={uploadingIndex === i}>
                          <span>
                            {uploadingIndex === i ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <><Upload size={14} className="mr-1" />アップロード</>
                            )}
                          </span>
                        </Button>
                      </label>
                    </div>
                    {img.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt="preview" className="h-24 w-auto rounded-lg object-cover border" />
                    )}
                    <Input
                      placeholder="キャプション（例：チブサン古墳の石室入口）"
                      value={img.caption}
                      onChange={(e) => {
                        const next = [...images];
                        next[i] = { ...next[i], caption: e.target.value };
                        setImages(next);
                      }}
                    />
                  </div>
                  {images.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-1"
                      onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground">1枚目がメイン写真になります。</p>
            </div>
            {/* Location */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin size={14} className="text-primary" />
                <span>位置情報（QRコード地図表示用）</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField control={form.control} name="lat" render={({ field }) => (
                  <FormItem>
                    <FormLabel>緯度（Latitude）</FormLabel>
                    <FormControl><Input type="number" step="any" placeholder="例：32.9942" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lng" render={({ field }) => (
                  <FormItem>
                    <FormLabel>経度（Longitude）</FormLabel>
                    <FormControl><Input type="number" step="any" placeholder="例：130.6877" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <p className="text-xs text-muted-foreground">
                Googleマップで場所を右クリック →「この場所について」で緯度・経度を確認できます
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="order" render={({ field }) => (
                <FormItem>
                  <FormLabel>表示順</FormLabel>
                  <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Intro page flag */}
            <FormField control={form.control} name="isIntro" render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3 rounded-xl border border-[#693c85]/30 bg-[#693c85]/5 px-4 py-3">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 accent-[#693c85]"
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="cursor-pointer text-sm font-medium text-foreground">
                      📖 EKIREIシステム紹介ページ
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      ONにすると「コーヒーについて」の代わりにスタンプブックの使い方ガイドを表示します
                    </p>
                  </div>
                </div>
              </FormItem>
            )} />

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

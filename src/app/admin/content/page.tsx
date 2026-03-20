"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSiteContent, setSiteContent } from "@/lib/firestore";
import type { SiteContentHero, SiteContentStory, SiteContentContact, StoryValue } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function ContentPage() {
  const [hero, setHero] = useState<SiteContentHero | null>(null);
  const [story, setStory] = useState<SiteContentStory | null>(null);
  const [contact, setContact] = useState<SiteContentContact | null>(null);
  const [savingHero, setSavingHero] = useState(false);
  const [savingStory, setSavingStory] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [heroImageProgress, setHeroImageProgress] = useState(0);
  const [uploadingStoryImage, setUploadingStoryImage] = useState(false);
  const [storyImageProgress, setStoryImageProgress] = useState(0);

  useEffect(() => {
    getSiteContent<SiteContentHero>("hero").then((data) => {
      setHero(data ?? {
        heading: "コーヒーの香りと共に、\n一日のはじまりを。",
        subheading: "厳選したスペシャルティコーヒーを、ひとつひとつ丁寧にドリップバッグへ。\n自宅で、どこでも、カフェの一杯を。",
        updatedAt: new Date(),
      });
    });
    getSiteContent<SiteContentStory>("story").then((data) => {
      setStory(data ?? {
        heading: "一杯のコーヒーに、\n想いを込めて。",
        body1: "EKIREI は、コーヒー好きが高じて始めた小さなブランドです。世界各地の農園を巡り、「これだ」と思える豆だけを仕入れ、一つひとつ丁寧にドリップバッグへと仕上げています。",
        body2: "忙しい朝でも、旅先でも、どこにいても本格的なコーヒーを楽しんでほしい——そんな想いからドリップバッグという形を選びました。",
        values: [
          { title: "産地への敬意", description: "コーヒーの産地を訪れ、生産者と直接対話しながら豆を選びます。フェアな取引と持続可能な農業を支援しています。" },
          { title: "丁寧な焙煎", description: "少量ずつ、豆の個性を最大限に引き出す焙煎プロファイルで仕上げます。注文後に焙煎することで、常に新鮮な状態でお届けします。" },
          { title: "簡単・美味しい", description: "ドリップバッグだから、特別な器具は不要。マグカップにセットしてお湯を注ぐだけで、カフェクオリティのコーヒーが楽しめます。" },
        ],
        updatedAt: new Date(),
      });
    });
    getSiteContent<SiteContentContact>("contact").then((data) => {
      setContact(data ?? {
        email: "hello@ekirei.jp",
        hours: "平日 10:00〜17:00",
        hoursNote: "（土日祝は翌営業日対応）",
        location: "東京都",
        updatedAt: new Date(),
      });
    });
  }, []);

  const saveHero = async () => {
    if (!hero) return;
    setSavingHero(true);
    try {
      await setSiteContent("hero", {
        heading: hero.heading,
        subheading: hero.subheading,
        imageUrl: hero.imageUrl ?? "",
      });
      toast.success("ヒーローセクションを保存しました");
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setSavingHero(false);
    }
  };

  const uploadHeroImage = async (file: File) => {
    setUploadingHeroImage(true);
    setHeroImageProgress(0);
    try {
      const storageRef = ref(storage, `hero/hero-image-${Date.now()}.${file.name.split(".").pop()}`);
      const task = uploadBytesResumable(storageRef, file);
      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => setHeroImageProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          resolve,
        );
      });
      const url = await getDownloadURL(storageRef);
      setHero((h) => h ? { ...h, imageUrl: url } : null);
      toast.success("画像をアップロードしました。「保存する」を押して反映してください。");
    } catch {
      toast.error("画像のアップロードに失敗しました");
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const removeHeroImage = async () => {
    if (!hero?.imageUrl) return;
    try {
      // Only delete Storage file if it's a Firebase Storage URL
      if (hero.imageUrl.includes("firebasestorage")) {
        await deleteObject(ref(storage, hero.imageUrl));
      }
      setHero((h) => h ? { ...h, imageUrl: "" } : null);
      await setSiteContent("hero", { heading: hero.heading, subheading: hero.subheading, imageUrl: "" });
      toast.success("画像を削除しました");
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  const saveStory = async () => {
    if (!story) return;
    setSavingStory(true);
    try {
      await setSiteContent("story", {
        heading: story.heading,
        body1: story.body1,
        body2: story.body2,
        imageUrl: story.imageUrl ?? "",
        values: story.values ?? [],
      });
      toast.success("ブランドストーリーを保存しました");
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setSavingStory(false);
    }
  };

  const uploadStoryImage = async (file: File) => {
    setUploadingStoryImage(true);
    setStoryImageProgress(0);
    try {
      const storageRef = ref(storage, `story/story-image-${Date.now()}.${file.name.split(".").pop()}`);
      const task = uploadBytesResumable(storageRef, file);
      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => setStoryImageProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          resolve,
        );
      });
      const url = await getDownloadURL(storageRef);
      setStory((s) => s ? { ...s, imageUrl: url } : null);
      toast.success("画像をアップロードしました。「保存する」を押して反映してください。");
    } catch {
      toast.error("画像のアップロードに失敗しました");
    } finally {
      setUploadingStoryImage(false);
    }
  };

  const removeStoryImage = async () => {
    if (!story?.imageUrl) return;
    try {
      if (story.imageUrl.includes("firebasestorage")) {
        await deleteObject(ref(storage, story.imageUrl));
      }
      setStory((s) => s ? { ...s, imageUrl: "" } : null);
      await setSiteContent("story", { heading: story.heading, body1: story.body1, body2: story.body2, imageUrl: "", values: story.values ?? [] });
      toast.success("画像を削除しました");
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  const updateStoryValue = (index: number, field: keyof StoryValue, value: string) => {
    setStory((s) => {
      if (!s) return null;
      const values = [...(s.values ?? [])];
      values[index] = { ...values[index], [field]: value };
      return { ...s, values };
    });
  };

  const saveContact = async () => {
    if (!contact) return;
    setSavingContact(true);
    try {
      await setSiteContent("contact", {
        email: contact.email,
        hours: contact.hours,
        hoursNote: contact.hoursNote,
        location: contact.location,
      });
      toast.success("お問い合わせ情報を保存しました");
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setSavingContact(false);
    }
  };

  return (
    <AdminGuard>
      <div className="flex h-dvh overflow-hidden">
        <AdminNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">サイト文章</h1>
            <p className="text-muted-foreground">ヒーローとブランドストーリーの文章を編集</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">サイト上部のヒーロー文章、ブランドストーリー、お問い合わせページの情報を編集できます。</p>
          </div>
          <div className="flex max-w-2xl flex-col gap-8">
            {/* Hero */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ヒーローセクション（トップの大見出し）</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>キャッチコピー</Label>
                  <Textarea
                    rows={2}
                    value={hero?.heading ?? ""}
                    onChange={(e) => setHero((h) => h ? { ...h, heading: e.target.value } : null)}
                    placeholder="コーヒーの香りと共に、&#10;一日のはじまりを。"
                  />
                  <p className="text-xs text-muted-foreground">改行を入れると2行になります</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>サブテキスト</Label>
                  <Textarea
                    rows={3}
                    value={hero?.subheading ?? ""}
                    onChange={(e) => setHero((h) => h ? { ...h, subheading: e.target.value } : null)}
                    placeholder="説明文を入力..."
                  />
                </div>
                {/* Hero image upload */}
                <div className="flex flex-col gap-1.5">
                  <Label>ファーストビュー写真</Label>
                  {hero?.imageUrl ? (
                    <div className="relative w-48">
                      <div className="relative aspect-[4/5] w-48 overflow-hidden rounded-xl border">
                        <Image src={hero.imageUrl} alt="ヒーロー画像" fill className="object-cover" sizes="192px" />
                      </div>
                      <button
                        type="button"
                        onClick={removeHeroImage}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow"
                        aria-label="画像を削除"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex w-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                      {uploadingHeroImage ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span className="text-xs">{heroImageProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          <span className="text-xs">写真を選択</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingHeroImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadHeroImage(file);
                        }}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground">推奨：縦長（4:5）の写真。右側に表示されます。</p>
                </div>

                <Button onClick={saveHero} disabled={savingHero} className="w-fit">
                  {savingHero ? <><Loader2 size={16} className="animate-spin mr-2" />保存中...</> : "保存する"}
                </Button>
              </CardContent>
            </Card>

            {/* Story */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ブランドストーリー</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>見出し</Label>
                  <Input
                    value={story?.heading ?? ""}
                    onChange={(e) => setStory((s) => s ? { ...s, heading: e.target.value } : null)}
                    placeholder="一杯のコーヒーに、想いを込めて。"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>本文（1段落目）</Label>
                  <Textarea
                    rows={4}
                    value={story?.body1 ?? ""}
                    onChange={(e) => setStory((s) => s ? { ...s, body1: e.target.value } : null)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>本文（2段落目）</Label>
                  <Textarea
                    rows={4}
                    value={story?.body2 ?? ""}
                    onChange={(e) => setStory((s) => s ? { ...s, body2: e.target.value } : null)}
                  />
                </div>

                {/* Story image */}
                <div className="flex flex-col gap-1.5">
                  <Label>写真（右側に表示）</Label>
                  {story?.imageUrl ? (
                    <div className="relative w-48">
                      <div className="relative aspect-square w-48 overflow-hidden rounded-xl border">
                        <Image src={story.imageUrl} alt="ストーリー画像" fill className="object-cover" sizes="192px" />
                      </div>
                      <button
                        type="button"
                        onClick={removeStoryImage}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow"
                        aria-label="画像を削除"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex w-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                      {uploadingStoryImage ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span className="text-xs">{storyImageProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          <span className="text-xs">写真を選択</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingStoryImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadStoryImage(file);
                        }}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground">正方形の写真がきれいに表示されます</p>
                </div>

                {/* Values */}
                <div className="flex flex-col gap-3">
                  <Label>こだわりポイント（3項目）</Label>
                  {(story?.values ?? []).map((v, i) => (
                    <div key={i} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                      <p className="text-xs font-medium text-muted-foreground">項目 {i + 1}</p>
                      <Input
                        value={v.title}
                        onChange={(e) => updateStoryValue(i, "title", e.target.value)}
                        placeholder="例：産地への敬意"
                      />
                      <Textarea
                        rows={2}
                        value={v.description}
                        onChange={(e) => updateStoryValue(i, "description", e.target.value)}
                        placeholder="説明文を入力..."
                      />
                    </div>
                  ))}
                </div>

                <Button onClick={saveStory} disabled={savingStory} className="w-fit">
                  {savingStory ? <><Loader2 size={16} className="animate-spin mr-2" />保存中...</> : "保存する"}
                </Button>
              </CardContent>
            </Card>
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">お問い合わせ情報</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>メールアドレス</Label>
                  <Input
                    value={contact?.email ?? ""}
                    onChange={(e) => setContact((c) => c ? { ...c, email: e.target.value } : null)}
                    placeholder="hello@ekirei.jp"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>対応時間</Label>
                  <Input
                    value={contact?.hours ?? ""}
                    onChange={(e) => setContact((c) => c ? { ...c, hours: e.target.value } : null)}
                    placeholder="平日 10:00〜17:00"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>対応時間（補足）</Label>
                  <Input
                    value={contact?.hoursNote ?? ""}
                    onChange={(e) => setContact((c) => c ? { ...c, hoursNote: e.target.value } : null)}
                    placeholder="（土日祝は翌営業日対応）"
                  />
                  <p className="text-xs text-muted-foreground">空にすると非表示になります</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>所在地</Label>
                  <Input
                    value={contact?.location ?? ""}
                    onChange={(e) => setContact((c) => c ? { ...c, location: e.target.value } : null)}
                    placeholder="東京都"
                  />
                </div>
                <Button onClick={saveContact} disabled={savingContact} className="w-fit">
                  {savingContact ? <><Loader2 size={16} className="animate-spin mr-2" />保存中...</> : "保存する"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

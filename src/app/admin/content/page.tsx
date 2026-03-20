"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSiteContent, setSiteContent } from "@/lib/firestore";
import type { SiteContentHero, SiteContentStory, SiteContentContact } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContentPage() {
  const [hero, setHero] = useState<SiteContentHero | null>(null);
  const [story, setStory] = useState<SiteContentStory | null>(null);
  const [contact, setContact] = useState<SiteContentContact | null>(null);
  const [savingHero, setSavingHero] = useState(false);
  const [savingStory, setSavingStory] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

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
      await setSiteContent("hero", { heading: hero.heading, subheading: hero.subheading });
      toast.success("ヒーローセクションを保存しました");
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setSavingHero(false);
    }
  };

  const saveStory = async () => {
    if (!story) return;
    setSavingStory(true);
    try {
      await setSiteContent("story", { heading: story.heading, body1: story.body1, body2: story.body2 });
      toast.success("ブランドストーリーを保存しました");
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setSavingStory(false);
    }
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

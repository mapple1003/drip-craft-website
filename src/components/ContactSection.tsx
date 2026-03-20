"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, MapPin, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  email: z.string().email("メールアドレスの形式が正しくありません"),
  message: z.string().min(10, "10文字以上で入力してください").max(1000, "1000文字以内で入力してください"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

async function submitContact(data: ContactFormValues): Promise<void> {
  await addDoc(collection(db, "contacts"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function ContactSection() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsPending(true);
    try {
      await submitContact(data);
      toast.success("お問い合わせを受け付けました。2〜3営業日以内にご連絡いたします。");
      form.reset();
    } catch {
      toast.error("送信に失敗しました。しばらく経ってから再度お試しください。");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary">CONTACT</p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            お問い合わせ
          </h2>
          <p className="text-muted-foreground">
            ご質問・ギフトのご相談・まとめ買いのご依頼など、
            <br className="hidden sm:block" />
            お気軽にご連絡ください。
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-5">
          {/* Info panel */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <div className="flex gap-4">
              <div
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "oklch(0.60 0.09 162 / 0.12)" }}
              >
                <Mail size={18} className="text-primary" />
              </div>
              <div>
                <p className="mb-1 font-semibold text-foreground">メール</p>
                <p className="text-sm text-muted-foreground">hello@dripcraft.jp</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "oklch(0.60 0.09 162 / 0.12)" }}
              >
                <Clock size={18} className="text-primary" />
              </div>
              <div>
                <p className="mb-1 font-semibold text-foreground">対応時間</p>
                <p className="text-sm text-muted-foreground">平日 10:00〜17:00</p>
                <p className="text-sm text-muted-foreground">（土日祝は翌営業日対応）</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "oklch(0.60 0.09 162 / 0.12)" }}
              >
                <MapPin size={18} className="text-primary" />
              </div>
              <div>
                <p className="mb-1 font-semibold text-foreground">所在地</p>
                <p className="text-sm text-muted-foreground">東京都</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="md:col-span-3">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>お名前</FormLabel>
                        <FormControl>
                          <Input placeholder="例：山田 太郎" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>メールアドレス</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="例：hello@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>メッセージ</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="ご質問やご要望をご記入ください"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        送信中...
                      </>
                    ) : (
                      "送信する"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/firestore";
import type { ProductDoc } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "入力してください"),
  description: z.string().min(1, "入力してください"),
  flavor: z.string().min(1, "入力してください"),
  price: z.string().min(1, "価格を入力してください"),
  imageUrl: z.string().optional(),
  order: z.string(),
  active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Props = {
  product?: ProductDoc;
};

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isEdit = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      flavor: product?.flavor?.join("、") ?? "",
      price: String(product?.price ?? 500),
      imageUrl: product?.imageUrl ?? "",
      order: String(product?.order ?? 0),
      active: product?.active ?? true,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsPending(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        flavor: data.flavor.split(/[、,，\s]+/).filter(Boolean),
        price: Number(data.price),
        imageUrl: data.imageUrl ?? "",
        order: Number(data.order),
        active: data.active,
      };

      if (isEdit) {
        await updateProduct(product.id, payload);
        toast.success("商品を更新しました");
      } else {
        await createProduct(payload);
        toast.success("商品を追加しました");
      }
      router.push("/admin/products");
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品名</FormLabel>
                  <FormControl>
                    <Input placeholder="例：チブサンブレンド" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明文</FormLabel>
                  <FormControl>
                    <Textarea placeholder="商品の説明を入力してください" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="flavor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>フレーバータグ</FormLabel>
                  <FormControl>
                    <Input placeholder="例：まろやか、コク、バランス（読点区切り）" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>価格（円）</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>表示順（小さい順）</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品画像URL</FormLabel>
                  <FormControl>
                    <Input placeholder="/images/product-chibusanblend.png" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    public/images/ に画像を置いた場合は /images/ファイル名 と入力してください
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <><Loader2 size={16} className="animate-spin mr-2" />保存中...</>
                ) : isEdit ? "更新する" : "追加する"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
                キャンセル
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

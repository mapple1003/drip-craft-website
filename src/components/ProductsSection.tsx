import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { products } from "@/data/products";
import { Coffee } from "lucide-react";

export function ProductsSection() {
  return (
    <section id="products" className="bg-muted/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary">LINEUP</p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            商品ラインナップ
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            世界各地から厳選したスペシャルティコーヒーを、
            それぞれの個性を活かしてドリップバッグにしました。
          </p>
        </div>

        {/* Product grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden transition-shadow hover:shadow-md"
            >
              {/* Product image area */}
              <div
                className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${product.gradient}`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm shadow-sm">
                  <Coffee size={36} className="text-stone-600" />
                </div>
                {/* Origin badge */}
                <span className="absolute bottom-3 right-3 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-stone-600 backdrop-blur-sm">
                  {product.origin}
                </span>
              </div>

              <CardHeader className="pb-2">
                <h3 className="font-bold text-foreground">{product.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {product.flavor.map((f) => (
                    <Badge
                      key={f}
                      variant="secondary"
                      className="text-xs"
                    >
                      {f}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  ¥{product.price.toLocaleString("ja-JP")}
                  <span className="text-xs font-normal text-muted-foreground"> /個</span>
                </span>
                {/* TODO(prod): Link to actual EC site or cart functionality */}
                <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                  購入
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            まとめ買いや贈り物のご相談は
            <a href="#contact" className="ml-1 text-primary underline underline-offset-4">
              お問い合わせ
            </a>
            ください
          </p>
        </div>
      </div>
    </section>
  );
}

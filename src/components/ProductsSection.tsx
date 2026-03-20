import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { products, productSet } from "@/data/products";
import { Coffee, Gift } from "lucide-react";

type ProductImageProps = {
  src?: string;
  alt: string;
  gradient: string;
};

function ProductImage({ src, alt, gradient }: ProductImageProps) {
  if (src) {
    return (
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
    );
  }
  // Fallback gradient while no photo is set
  return (
    <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${gradient}`}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm shadow-sm">
        <Coffee size={36} className="text-stone-600" />
      </div>
    </div>
  );
}

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
            地域の名所や自然からインスパイアされた、
            EKIREIオリジナルのドリップバッグコーヒーです。
          </p>
        </div>

        {/* Product grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden transition-shadow hover:shadow-md"
            >
              <ProductImage
                src={product.image}
                alt={product.name}
                gradient={product.gradient}
              />

              <CardHeader className="pb-2">
                <h3 className="font-bold text-foreground">{product.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {product.flavor.map((f) => (
                    <Badge key={f} variant="secondary" className="text-xs">
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

        {/* 4-variety set */}
        <div className="mt-10">
          <Card className="group overflow-hidden transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row">
              <div className="relative sm:w-64 shrink-0">
                <ProductImage
                  src={productSet.image}
                  alt={productSet.name}
                  gradient={productSet.gradient}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Gift size={18} className="text-accent" />
                    <span className="text-sm font-medium text-accent">ギフトにもおすすめ</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">{productSet.name}</h3>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {productSet.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {productSet.contents.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    ¥{productSet.price.toLocaleString("ja-JP")}
                    <span className="text-sm font-normal text-muted-foreground"> /セット</span>
                  </span>
                  {/* TODO(prod): Link to actual EC site or cart functionality */}
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
                    購入
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
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

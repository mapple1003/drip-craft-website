import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

// Placeholder grid items representing Instagram posts
const placeholderPosts = [
  { id: 1, gradient: "from-amber-100 to-orange-200", emoji: "☕" },
  { id: 2, gradient: "from-teal-100 to-emerald-200", emoji: "🌿" },
  { id: 3, gradient: "from-rose-100 to-pink-200", emoji: "☕" },
  { id: 4, gradient: "from-stone-100 to-amber-200", emoji: "📦" },
  { id: 5, gradient: "from-purple-100 to-violet-200", emoji: "✨" },
  { id: 6, gradient: "from-sky-100 to-blue-200", emoji: "☕" },
];

export function InstagramSection() {
  // TODO(prod): Replace placeholder grid with real Instagram Basic Display API or oEmbed feed

  return (
    <section id="instagram" className="bg-muted/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary">INSTAGRAM</p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            日々のコーヒーを
            <br className="sm:hidden" />
            シェアしています
          </h2>
          <p className="text-muted-foreground">
            豆の産地、焙煎の様子、おすすめのドリップ方法など。
          </p>
        </div>

        {/* Instagram photo grid */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {placeholderPosts.map((post) => (
            <a
              key={post.id}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl"
              aria-label={`Instagram投稿 ${post.id}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${post.gradient} transition-transform duration-300 group-hover:scale-105`}
              />
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                {post.emoji}
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 transition-colors group-hover:bg-black/10">
                <Instagram
                  size={24}
                  className="text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100"
                />
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
              <Instagram size={16} />
              @dripcraftcoffee をフォロー
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

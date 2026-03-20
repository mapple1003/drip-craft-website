export type Product = {
  id: string;
  name: string;
  description: string;
  flavor: string[];
  price: number;
  gradient: string;
  image?: string; // Optional product photo path (e.g. "/images/product-chibusanblend.png")
};

export const products: Product[] = [
  {
    id: "chibusanblend",
    name: "チブサンブレンド",
    description: "EKIREIオリジナルブレンド。豊かなコクと穏やかな香りが広がる、毎日飲みたくなる一杯。",
    flavor: ["まろやか", "コク", "バランス"],
    price: 500,
    gradient: "from-amber-100 to-orange-200",
    image: "/images/product-chibusanblend.png",
  },
  {
    id: "fudoiwa",
    name: "不動岩ブレンド",
    description: "力強い風味と深みのある味わい。ゆっくりと流れる時間を楽しみたい日の一杯に。",
    flavor: ["力強い", "深み", "ビター"],
    price: 500,
    gradient: "from-stone-200 to-amber-300",
    image: "/images/product-fudoiwa.png",
  },
  {
    id: "aira-tobikatura",
    name: "アイラトビカズラブレンド",
    description: "華やかな香りと柔らかな甘さが特徴。特別な朝にふさわしい、上品な味わい。",
    flavor: ["華やか", "甘み", "フローラル"],
    price: 500,
    gradient: "from-rose-100 to-pink-200",
    image: "/images/product-aira-tobikatura.png",
  },
  {
    id: "sakurayu",
    name: "さくら湯ブレンド",
    description: "やさしい口当たりとほのかな甘み。春のような穏やかさを感じるすっきりとした一杯。",
    flavor: ["やさしい", "すっきり", "ほんのり甘い"],
    price: 500,
    gradient: "from-pink-100 to-rose-200",
    image: "/images/product-sakurayu.png",
  },
];

// 4種セット（個別商品とは別に表示）
export const productSet = {
  id: "set-4",
  name: "４種セット",
  description: "チブサンブレンド・不動岩ブレンド・アイラトビカズラブレンド・さくら湯ブレンドを各1袋ずつ。はじめての方やギフトに最適。",
  contents: products.map((p) => p.name),
  price: 1800,
  gradient: "from-teal-100 to-emerald-200",
  image: "/images/product-set.png",
};

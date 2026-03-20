export type Product = {
  id: string;
  name: string;
  origin: string;
  description: string;
  flavor: string[];
  price: number;
  gradient: string;
};

export const products: Product[] = [
  {
    id: "ethiopia-natural",
    name: "エチオピア ナチュラル",
    origin: "エチオピア・イルガチェフェ",
    description: "ベリー系の甘い香りと、フルーティーな酸味が特徴。まるでフルーツジュースのような飲み口。",
    flavor: ["ブルーベリー", "ストロベリー", "フローラル"],
    price: 580,
    gradient: "from-rose-100 to-pink-200",
  },
  {
    id: "colombia-huila",
    name: "コロンビア ウィラ",
    origin: "コロンビア・ウィラ県",
    description: "上質なコクと程よい酸味のバランスが絶妙。毎日飲んでも飽きない、定番の味わい。",
    flavor: ["キャラメル", "ナッツ", "マイルド"],
    price: 550,
    gradient: "from-amber-100 to-yellow-200",
  },
  {
    id: "guatemala-antigua",
    name: "グアテマラ アンティグア",
    origin: "グアテマラ・アンティグア",
    description: "チョコレートのような深いコクとスモーキーな余韻。深煎り好きにおすすめの一杯。",
    flavor: ["ダークチョコ", "スモーク", "ビター"],
    price: 560,
    gradient: "from-stone-200 to-amber-300",
  },
  {
    id: "original-blend",
    name: "オリジナルブレンド",
    origin: "ブレンド（複数産地）",
    description: "ブランドの顔となるオリジナルブレンド。バランス良く、朝の一杯に最適な飲みやすさ。",
    flavor: ["バランス", "まろやか", "すっきり"],
    price: 500,
    gradient: "from-teal-100 to-emerald-200",
  },
];

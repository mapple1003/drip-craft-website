"use client";

import Link from "next/link";

type TrophyType = "collector" | "explorer";

type Props = {
  type: TrophyType;
  spotName: string;
  onClose: () => void;
};

const TROPHY_INFO: Record<TrophyType, { emoji: string; title: string; titleEn: string; subtitle: string; subtitleEn: string; color: string }> = {
  collector: {
    emoji: "🎫",
    title: "コレクタートロフィー獲得！",
    titleEn: "Collector Trophy Unlocked!",
    subtitle: "ドリップバッグのQRコードを読み込みました",
    subtitleEn: "You scanned the QR code on a drip bag",
    color: "#693c85",
  },
  explorer: {
    emoji: "🗺️",
    title: "探訪者トロフィー獲得！",
    titleEn: "Explorer Trophy Unlocked!",
    subtitle: "この名所を実際に訪問しました",
    subtitleEn: "You visited this landmark in person",
    color: "#539d84",
  },
};

export function TrophyOverlay({ type, spotName, onClose }: Props) {
  const info = TROPHY_INFO[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Trophy emoji */}
        <div className="mb-4 text-7xl">{info.emoji}</div>

        {/* Star burst */}
        <div className="mb-2 flex justify-center gap-1 text-yellow-400">
          {"★★★★★".split("").map((s, i) => (
            <span key={i} className="animate-in fade-in duration-500" style={{ animationDelay: `${i * 80}ms` }}>
              {s}
            </span>
          ))}
        </div>

        <h2 className="mb-0.5 text-xl font-bold" style={{ color: info.color }}>
          {info.title}
        </h2>
        <p className="mb-1 text-sm font-medium" style={{ color: info.color, opacity: 0.7 }}>
          {info.titleEn}
        </p>
        <p className="mb-0.5 text-sm text-muted-foreground">{info.subtitle}</p>
        <p className="mb-1 text-xs text-muted-foreground/70">{info.subtitleEn}</p>
        <p className="mb-6 text-base font-semibold text-foreground">「{spotName}」</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/collection"
            className="block w-full rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: info.color }}
            onClick={onClose}
          >
            コレクションを見る / View Collection
          </Link>
          <button
            onClick={onClose}
            className="w-full rounded-full border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            閉じる / Close
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

const SpotMapInner = dynamic(() => import("./SpotMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
      地図を読み込み中...
    </div>
  ),
});

type Props = {
  lat: number;
  lng: number;
  name: string;
  spots?: { id: string; name: string; lat: number; lng: number; scanned: boolean; visited: boolean }[];
};

export function SpotMap({ lat, lng, name, spots }: Props) {
  return <SpotMapInner lat={lat} lng={lng} name={name} spots={spots} />;
}

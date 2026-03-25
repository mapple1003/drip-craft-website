"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons (webpack/Next.js issue)
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

type Props = {
  lat: number;
  lng: number;
  name: string;
  /** If true, shows all spots with different colors */
  spots?: { id: string; name: string; lat: number; lng: number; scanned: boolean; visited: boolean }[];
};

export default function SpotMapInner({ lat, lng, name, spots }: Props) {
  if (spots && spots.length > 0) {
    // Collection map — all spots
    return (
      <MapContainer
        center={[lat, lng]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        className="rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spots.map((s) => {
          const color = s.visited ? "#539d84" : s.scanned ? "#693c85" : "#94a3b8";
          const icon = L.divIcon({
            html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            className: "",
          });
          return (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={icon}>
              <Popup>
                <span className="text-sm font-medium">{s.name}</span>
                <br />
                <span className="text-xs text-gray-500">
                  {s.visited ? "✅ 訪問済み" : s.scanned ? "🎫 コレクト済み" : "未入手"}
                </span>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    );
  }

  // Single spot map
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      className="rounded-xl"
    >
      <RecenterMap lat={lat} lng={lng} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}

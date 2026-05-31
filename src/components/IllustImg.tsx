"use client";

// Simple illustration image component
// Prefers SVG (vector, infinite quality) → PNG fallback
export function IllustImg({
  name,
  alt = "",
  className = "",
  style,
}: {
  name: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${name}.svg`}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.src.endsWith(".png")) {
          img.src = `/images/${name}.png`;
        }
      }}
    />
  );
}

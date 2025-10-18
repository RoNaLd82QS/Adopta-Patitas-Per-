"use client";
import { useState } from "react";

export default function ImageFallback({
  src,
  alt = "",
  className,
  fallback = "https://placehold.co/800x600?text=Adoptapatitas",
}: {
  src: string;
  alt?: string;
  className?: string;
  fallback?: string;
}) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
    />
  );
}

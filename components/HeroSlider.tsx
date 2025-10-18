"use client";

import { useEffect, useState } from "react";

const slides = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"]; // pon tus fotos en /public

export default function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  function go(n: number) {
    setI((prev) => (prev + n + slides.length) % slides.length);
  }

  const src = slides[i] || "https://placehold.co/1600x600?text=Adoptapatitas";

  return (
    <div className="relative rounded-3xl overflow-hidden border bg-slate-200">
      <img src={src} alt="" className="h-[60vh] w-full object-cover" />
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/80 hover:bg-white"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/80 hover:bg-white"
        aria-label="Siguiente"
      >
        ›
      </button>

      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center text-white drop-shadow-lg">
          <h1 className="title-script text-5xl md:text-6xl">
            Somos la voz de los perros
          </h1>
        </div>
      </div>

      <div className="absolute bottom-4 w-full flex items-center justify-center gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full ${
              i === idx ? "bg-white" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

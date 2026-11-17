"use client";

import { useEffect, useRef } from "react";

/** Image de fond fixe : se floute et s'estompe au défilement (comme sur le site d'origine). */
export default function Banner({ image }: { image: string }) {
  const fond = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opaciteFinale = 0.4;
    const flouFinal = 15;
    const update = () => {
      const el = fond.current;
      if (!el) return;
      const fin = window.innerHeight;
      const ratio = Math.min(window.scrollY / fin, 1);
      el.style.opacity = String(1 - opaciteFinale * ratio);
      el.style.filter = `blur(${Math.round(flouFinal * ratio)}px)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="banniere">
      <div className="fond" ref={fond} style={{ backgroundImage: `url('${image}')` }} />
      <div className="motif" />
    </div>
  );
}

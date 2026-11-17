"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/** Bouton « Haut du site », visible après 500 px de défilement. */
export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="remonter"
      style={{ display: "block", opacity: visible ? 1 : 0, visibility: visible ? "visible" : "hidden", transition: "opacity .4s, visibility .4s" }}
    >
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={site.icons.remonter} width={24} height={13} alt="Haut du site" />
      </button>
    </div>
  );
}

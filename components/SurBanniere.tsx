"use client";

import { useEffect, useRef } from "react";
import SocialIcons from "./SocialIcons";

type Props = { titre: string; sousTitre: string | null };

/** Zone plein écran sous la bannière : réseaux sociaux / WhatsApp, slogan et flèche « Aller au contenu ». */
export default function SurBanniere({ titre, sousTitre }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      if (ref.current) ref.current.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const descendre = (e: React.MouseEvent) => {
    e.preventDefault();
    const corps = ref.current?.parentElement?.querySelector(".corps");
    if (corps) window.scrollTo({ top: corps.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
  };

  return (
    <div className="sur-banniere" ref={ref}>
      <div className="infos">
        <SocialIcons className="btn-partage" whatsapp />
      </div>
      <p className="slogan">
        <strong className="titre" dangerouslySetInnerHTML={{ __html: titre }} />
        <br />
        {sousTitre && (
          <>
            <span className="sous-titre" dangerouslySetInnerHTML={{ __html: sousTitre }} />
            <br />
          </>
        )}
        <a href="#" className="btn-descendre hidden-sm hidden-xs" title="Aller au contenu" onClick={descendre}>
          <span>Aller au contenu</span>
        </a>
      </p>
    </div>
  );
}

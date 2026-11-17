"use client";

import { useCallback, useEffect, useState } from "react";

type Item = { src: string; title: string };
type State = { items: Item[]; index: number } | null;

/**
 * Visionneuse photo (reprend le balisage et le style « Lightbox2 » du site d'origine).
 * Tout lien <a data-lightbox="groupe"> ouvre la visionneuse avec les photos du même groupe.
 */
export default function Lightbox() {
  const [state, setState] = useState<State>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  // Ouverture au clic sur une vignette (délégation sur le document)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-lightbox]");
      if (!link) return;
      e.preventDefault();
      const group = link.dataset.lightbox!;
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(`a[data-lightbox="${CSS.escape(group)}"]`)).filter(
        (a) => a.offsetParent !== null || a === link,
      );
      const items: Item[] = [];
      let index = 0;
      for (const a of links) {
        const src = a.getAttribute("href")!;
        if (items.some((it) => it.src === src)) {
          if (a === link) index = items.findIndex((it) => it.src === src);
          continue;
        }
        if (a === link) index = items.length;
        items.push({ src, title: a.title });
      }
      setSize(null);
      setState({ items, index });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => setState(null), []);
  const go = useCallback((delta: number) => {
    setSize(null);
    setState((s) => (s ? { ...s, index: (s.index + delta + s.items.length) % s.items.length } : s));
  }, []);

  // Clavier : Échap, flèches
  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close, go]);

  // Calcul de la taille d'affichage une fois l'image chargée
  const current = state?.items[state.index];
  useEffect(() => {
    if (!current) return;
    const img = new Image();
    img.onload = () => {
      const maxW = window.innerWidth - 40;
      const maxH = window.innerHeight - 120;
      const ratio = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
      setSize({ w: Math.round(img.naturalWidth * ratio), h: Math.round(img.naturalHeight * ratio) });
    };
    img.src = current.src;
  }, [current]);

  if (!state || !current) return null;
  const many = state.items.length > 1;
  const outer = size ? { width: size.w + 8, height: size.h + 8 } : undefined;

  return (
    <>
      <div className="lightboxOverlay" onClick={close} style={{ display: "block", position: "fixed", inset: 0, width: "100%", height: "100%" }} />
      <div
        className="lightbox"
        style={{ display: "block", position: "fixed", top: 40, left: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="lb-outerContainer" style={{ ...outer, transition: "width .3s, height .3s" }}>
          <div className="lb-container">
            {size && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="lb-image" src={current.src} alt={current.title} style={{ display: "block", width: size.w, height: size.h }} />
            )}
            {many && size && (
              <div className="lb-nav" style={{ display: "block" }}>
                <a className="lb-prev" href="#" aria-label="Photo précédente" onClick={(e) => (e.preventDefault(), go(-1))} />
                <a className="lb-next" href="#" aria-label="Photo suivante" onClick={(e) => (e.preventDefault(), go(1))} />
              </div>
            )}
            {!size && (
              <div className="lb-loader" style={{ display: "block" }}>
                <a className="lb-cancel" href="#" onClick={(e) => (e.preventDefault(), close())} />
              </div>
            )}
          </div>
        </div>
        <div className="lb-dataContainer" style={{ display: "block", width: outer?.width ?? 250 }}>
          <div className="lb-data">
            <div className="lb-details">
              {many && (
                <span className="lb-number" style={{ display: "block" }}>
                  Image {state.index + 1} sur {state.items.length}
                </span>
              )}
            </div>
            <div className="lb-closeContainer">
              <a className="lb-close" href="#" aria-label="Fermer" onClick={(e) => (e.preventDefault(), close())} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

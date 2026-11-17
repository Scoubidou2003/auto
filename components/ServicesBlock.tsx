"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const DELAY = 5000; // durée d'affichage d'une photo (valeur par défaut de Vegas, utilisé à l'origine)
const TRANSITION = 1000;

/** Bloc « Nos services » : diaporama des photos à gauche, liste des services à droite. */
export default function ServicesBlock() {
  const slides = site.servicesSlides;
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
      setCycle((c) => c + 1);
    }, DELAY);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="services">
      <div className="cell gauche">
        <div className="photos slidebg vegas-container" style={{ position: "relative" }}>
          {slides.map((src, i) => (
            <div
              key={src}
              className={`vegas-slide vegas-transition-fade${i === index ? " vegas-transition-fade-in" : ""}`}
              style={{ transition: `all ${TRANSITION}ms` }}
            >
              <div
                className="vegas-slide-inner"
                style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center center" }}
              />
            </div>
          ))}
          <TimerBar key={cycle} />
        </div>
      </div>
      <div className="cell droite">
        <div className="contenu">
          <h2 className="h1 sans-image">Nos services</h2>
          <ul className="liste-services">
            {site.servicesList.map((s, i) => (
              <li key={s.href} className={`delay-${(i + 1) * 200}`}>
                <Link href={s.href} className="bouton-principal hvr-shutter-out-horizontal">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Barre de progression en bas du diaporama (« timer » Vegas). */
function TimerBar() {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setRunning(true));
    return () => cancelAnimationFrame(r);
  }, []);
  return (
    <div className={`vegas-timer${running ? " vegas-timer-running" : ""}`}>
      <div className="vegas-timer-progress" style={{ transitionDuration: running ? `${DELAY - TRANSITION}ms` : "0ms" }} />
    </div>
  );
}

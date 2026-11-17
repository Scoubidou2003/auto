"use client";

import { useState, useSyncExternalStore } from "react";
import { useContact } from "./ContactProvider";

type Props = { className: string; withTexte?: boolean };

const PHONE_QUERY = "(max-width: 767px) and (pointer: coarse)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Numéro WhatsApp masqué derrière « Afficher le numéro » (comme à l'origine).
 * Une fois affiché, le numéro ouvre la conversation WhatsApp ; sur téléphone il est affiché d'office.
 * Le numéro vient de la variable d'environnement SITE_PHONE.
 */
export default function PhoneReveal({ className, withTexte = true }: Props) {
  const { phone, whatsappHref } = useContact();
  const [clicked, setClicked] = useState(false);
  const isPhone = useSyncExternalStore(subscribe, () => window.matchMedia(PHONE_QUERY).matches, () => false);
  const active = clicked || isPhone;

  if (!phone) return null;

  const texte = withTexte ? " texte" : "";
  const classes = className.replace(/\bactive\b/, "").trim();

  return (
    <>
      <p className={`${classes} tel-whatsapp${active ? " active" : ""}`} onClick={() => setClicked(true)}>
        <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp :{" "}
        <a className={`t_phone${texte}`} href={whatsappHref} target="_blank" rel="noopener nofollow">
          {phone}
        </a>
        <span className={`t_affiche${texte}`}>Afficher le numéro</span>
      </p>
      <p className="mention-whatsapp">Joignable uniquement sur WhatsApp (appels et messages).</p>
    </>
  );
}

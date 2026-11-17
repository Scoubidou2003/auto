"use client";

import { useContact } from "./ContactProvider";

/** Bouton flottant présent sur toutes les pages : l'achat de pièces se fait par WhatsApp. */
export default function CallButton() {
  const { phone, whatsappHref } = useContact();
  if (!phone) return null;
  return (
    <a
      href={whatsappHref}
      className="btn-whatsapp-achat hide-print"
      target="_blank"
      rel="noopener nofollow"
      aria-label={`Acheter une pièce : nous écrire sur WhatsApp au ${phone}`}
    >
      <i className="fa-brands fa-whatsapp" aria-hidden="true" />
      <span className="btn-whatsapp-texte">
        <span className="btn-whatsapp-titre">Acheter une pièce</span>
        <span className="btn-whatsapp-numero">{phone}</span>
        <span className="btn-whatsapp-mention">WhatsApp uniquement</span>
      </span>
    </a>
  );
}

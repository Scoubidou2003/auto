"use client";

import { useContact } from "./ContactProvider";

/** Icônes rondes des réseaux sociaux du garage (Facebook, TikTok) et de WhatsApp. */
export default function SocialIcons({ className = "reseaux-sociaux", whatsapp = false }: { className?: string; whatsapp?: boolean }) {
  const { facebook, tiktok, phone, whatsappHref } = useContact();
  const links = [
    facebook && { href: facebook, cls: "rs-facebook", icon: "fa-facebook-f", label: "Suivez-nous sur Facebook" },
    tiktok && { href: tiktok, cls: "rs-tiktok", icon: "fa-tiktok", label: "Suivez-nous sur TikTok" },
    whatsapp && phone && { href: whatsappHref, cls: "rs-whatsapp", icon: "fa-whatsapp", label: "Écrivez-nous sur WhatsApp" },
  ].filter((l): l is { href: string; cls: string; icon: string; label: string } => Boolean(l));
  if (!links.length) return null;
  return (
    <div className={className}>
      {links.map((l) => (
        <a key={l.cls} className={`btn-rs-rond ${l.cls}`} href={l.href} target="_blank" rel="noopener" title={l.label} aria-label={l.label}>
          <i className={`fa-brands ${l.icon}`} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

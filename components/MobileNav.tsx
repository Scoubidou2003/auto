"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { useContact } from "./ContactProvider";
import SocialIcons from "./SocialIcons";

type Panel = "none" | "left" | "right";

/**
 * En-tête et menus latéraux mobiles (navigation à gauche, contact à droite).
 * Le composant est recréé à chaque page (key = route), ce qui referme les menus.
 */
export default function MobileNav({ active }: { active: string | null }) {
  const [open, setOpen] = useState<Panel>("none");
  const contact = useContact();

  const toggle = (panel: Panel) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen((cur) => (cur === panel ? "none" : panel));
  };
  const close = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen("none");
  };

  return (
    <>
      <div className="header-sidebars hidden-md hidden-lg hide-print">
        <div className="header-top">
          <a aria-label="Ouvrir le menu" href="#" className="deploy-left-sidebar" onClick={toggle("left")} />
          <Link href="/" className="top-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logo} width={413} height={62} alt={site.name} />
          </Link>
          <a aria-label="Ouvrir le menu" href="#" className="deploy-right-sidebar" onClick={toggle("right")} />
        </div>
      </div>

      <div className="sidebar-left hidden-md hidden-lg hide-print" style={{ left: open === "left" ? 0 : -270 }}>
        <div className="sidebar-scroll-left">
          <div className="sidebar-header-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logo} className="sidebar-left-logo" width={413} height={62} alt={site.name} />
            <a aria-label="Fermer le menu" href="#" className="close-sidebar-left" onClick={close} />
          </div>
          <p className="sidebar-divider-text">NAVIGATION</p>
          <ul id="menu-main-menu" className="menu-mobile-dynamique">
            {site.mainMenu.map((item) => (
              <li key={item.href} className={`menu-item${item.href === active ? " active" : ""}`}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <SocialIcons className="reseaux-sociaux menu-mobile-rs" whatsapp />
          <div className="sidebar-bottom-controls">
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noopener">
                <span className="facebook-bottom" />
                <p>Facebook</p>
              </a>
            )}
            {contact.tiktok && (
              <a href={contact.tiktok} target="_blank" rel="noopener">
                <span className="tiktok-bottom">
                  <i className="fa-brands fa-tiktok" aria-hidden="true" />
                </span>
                <p>TikTok</p>
              </a>
            )}
            <a href="#" onClick={close}>
              <span className="close-bottom-left" />
              <p>Fermer</p>
            </a>
            <div className="clear" />
          </div>
        </div>
      </div>

      <div className="sidebar-right hidden-md hidden-lg hide-print" style={{ right: open === "right" ? -10 : -280 }}>
        <div className="sidebar-scroll-right">
          <div className="sidebar-header-right">
            <a aria-label="Fermer le menu" href="#" className="close-sidebar-right" onClick={close} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logo} className="sidebar-right-logo" width={413} height={62} alt={site.name} />
          </div>
          <p className="sidebar-divider-text">CONTACT</p>
          {contact.email ? (
            <a href={contact.emailHref} className="nav-item mail-nav">
              ENVOYER UN EMAIL
            </a>
          ) : (
            <Link href="/contact-remorquage-epaves-94" className="nav-item mail-nav">
              ENVOYER UN EMAIL
            </Link>
          )}
          {contact.phone && (
            <a href={contact.whatsappHref} className="nav-item whatsapp-nav" target="_blank" rel="noopener nofollow">
              <i className="fa-brands fa-whatsapp" aria-hidden="true" />
              WHATSAPP UNIQUEMENT
            </a>
          )}
          <p className="sidebar-divider-text">RÉSEAUX SOCIAUX</p>
          {contact.facebook && (
            <a href={contact.facebook} target="_blank" rel="noopener" className="nav-item facebook-nav">
              FACEBOOK
            </a>
          )}
          {contact.tiktok && (
            <a href={contact.tiktok} target="_blank" rel="noopener" className="nav-item tiktok-nav">
              <i className="fa-brands fa-tiktok" aria-hidden="true" />
              TIKTOK
            </a>
          )}
          <div className="sidebar-bottom-controls">
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noopener">
                <span className="facebook-bottom" />
                <p>Facebook</p>
              </a>
            )}
            {contact.tiktok && (
              <a href={contact.tiktok} target="_blank" rel="noopener">
                <span className="tiktok-bottom">
                  <i className="fa-brands fa-tiktok" aria-hidden="true" />
                </span>
                <p>TikTok</p>
              </a>
            )}
            <a href="#" onClick={close}>
              <span className="close-bottom-right" />
              <p>Fermer</p>
            </a>
            <div className="clear" />
          </div>
        </div>
      </div>

      <div style={{ height: 50 }} className="hidden-md hidden-lg" />
    </>
  );
}

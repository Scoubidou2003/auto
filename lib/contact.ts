import { connection } from "next/server";

/**
 * Coordonnées du site, lues dans les variables d'environnement (voir .env.example) :
 *   SITE_PHONE            numéro WhatsApp (seul moyen de joindre le garage par téléphone)
 *   SITE_EMAIL            adresse e-mail affichée (et destinataire du formulaire si CONTACT_TO est vide)
 *   SITE_FACEBOOK_URL     page Facebook
 *   SITE_TIKTOK_URL       compte TikTok
 *   SITE_WHATSAPP_MESSAGE message pré-rempli à l'ouverture de WhatsApp (facultatif)
 *
 * Les valeurs sont lues à chaque requête : il suffit de modifier la variable et de
 * redémarrer le serveur, sans recompiler le site.
 */
export { EMPTY_CONTACT, type Contact } from "./contact-shared";
import type { Contact } from "./contact-shared";

const DEFAULT_WHATSAPP_MESSAGE = "Bonjour, je souhaite acheter une pièce auto.";

/** wa.me attend le numéro au format international, sans « + » ni espaces (un 06… français devient 336…). */
function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.length === 10 && digits.startsWith("0")) return "33" + digits.slice(1);
  return digits;
}

let warned = false;

/** Lecture directe des variables (Route Handlers, qui sont déjà rendus à chaque requête). */
export function readContact(): Contact {
  const env = (name: string) => (process.env[name] ?? "").trim();
  const phone = env("SITE_PHONE");
  const email = env("SITE_EMAIL");
  if ((!phone || !email) && !warned) {
    warned = true;
    console.warn("[contact] SITE_PHONE ou SITE_EMAIL n'est pas défini (voir .env.example).");
  }
  const message = env("SITE_WHATSAPP_MESSAGE") || DEFAULT_WHATSAPP_MESSAGE;
  return {
    phone,
    whatsappHref: phone ? `https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(message)}` : "",
    email,
    emailHref: email ? `mailto:${email}` : "",
    facebook: env("SITE_FACEBOOK_URL"),
    tiktok: env("SITE_TIKTOK_URL"),
  };
}

/** Lecture pour les pages : force le rendu à la requête pour toujours afficher la valeur actuelle. */
export async function getContact(): Promise<Contact> {
  await connection();
  return readContact();
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Remplace les marqueurs {{TELEPHONE}} et {{EMAIL}} du contenu des pages.
 * Le numéro devient un lien WhatsApp (avec le logo), l'e-mail un lien mailto.
 */
export function fillContactHtml(html: string, c: Contact): string {
  const phone = c.phone
    ? `<a href="${escapeHtml(c.whatsappHref)}" class="lien-whatsapp" target="_blank" rel="noopener nofollow" title="Joignable uniquement sur WhatsApp"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i>${escapeHtml(c.phone)}<span class="sr-only"> (WhatsApp)</span></a>`
    : "";
  const email = c.email ? `<a href="${escapeHtml(c.emailHref)}" class="lien-email">${escapeHtml(c.email)}</a>` : "";
  return html.replaceAll("{{TELEPHONE}}", phone).replaceAll("{{EMAIL}}", email);
}

/** Variante texte brut (titres, descriptions, llms.txt). */
export function fillContactText(text: string, c: Contact): string {
  return text
    .replaceAll("{{TELEPHONE}}", c.phone)
    .replaceAll("{{EMAIL}}", c.email)
    .replaceAll("{{FACEBOOK}}", c.facebook)
    .replaceAll("{{TIKTOK}}", c.tiktok);
}

/** Type des coordonnées, partagé entre serveur et navigateur (voir lib/contact.ts). */
export type Contact = {
  /** Numéro WhatsApp tel qu'il est affiché */
  phone: string;
  /** Lien d'ouverture de la conversation WhatsApp (https://wa.me/...) */
  whatsappHref: string;
  email: string;
  emailHref: string;
  facebook: string;
  tiktok: string;
};

export const EMPTY_CONTACT: Contact = { phone: "", whatsappHref: "", email: "", emailHref: "", facebook: "", tiktok: "" };

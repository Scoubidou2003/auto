import siteJson from "@/content/site.json";

/** Coordonnées, menus et réglages communs (utilisable côté client comme côté serveur). */
export const site = siteJson;
export type Site = typeof siteJson;

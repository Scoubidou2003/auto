import fs from "node:fs";
import path from "node:path";
import routesJson from "@/content/routes.json";
import galleriesJson from "@/content/galleries.json";
export { site } from "./site";

export type Photo = { title: string; large: string; medium: string };

export type PageData = {
  route: string;
  source: string;
  title: string;
  description: string;
  ogImage: string | null;
  bodyClass: string;
  template: "page" | "pageseo" | "contact" | "gallery" | "service-list" | "service" | "copyright" | "sitemap";
  bannerImage: string;
  slogan: { titre: string; sousTitre: string | null };
  activeMenu: string | null;
  corpsHtml: string;
  homePhotos: Photo[] | null;
  sections: { services: boolean; realisations: Photo[] | null; gmbImage: string | null };
  footerForm: boolean;
};

export type MenuItem = { label: string; href: string };
export type Gallery = { id: string; label: string; photos: Photo[] };

const galleries = galleriesJson as Gallery[];

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

function fileForRoute(route: string) {
  const name = route === "/" ? "index" : route.slice(1).replace(/\//g, "__");
  return path.join(PAGES_DIR, `${name}.json`);
}

export function getPage(route: string): PageData | null {
  const file = fileForRoute(route);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as PageData;
}

export function getAllRoutes(): string[] {
  return routesJson.map((p) => p.route);
}

/** Toutes les photos du site (galerie + photos « qui sommes-nous »), sans doublon. */
export function allPhotos(): Photo[] {
  const seen = new Set<string>();
  const out: Photo[] = [];
  const home = getPage("/");
  for (const p of [...galleries.flatMap((g) => g.photos), ...(home?.homePhotos ?? [])]) {
    if (seen.has(p.large)) continue;
    seen.add(p.large);
    out.push(p);
  }
  return out;
}

/** Sélection stable de `count` photos pour une page, pour varier d'une page à l'autre. */
export function photosForPage(page: PageData, count = 3): Photo[] {
  const photos = allPhotos();
  const id = Number(page.bodyClass.match(/(\d+)\s*$/)?.[1] ?? 0);
  const start = (id * 5) % photos.length;
  return Array.from({ length: Math.min(count, photos.length) }, (_, i) => photos[(start + i * 4) % photos.length]);
}

/** Photos de la galerie correspondant à une fiche service (31 = vente, 32 = rachat). */
export function photosForService(page: PageData): Photo[] {
  const serviceId = page.bodyClass.match(/body-service-(\d+)/)?.[1];
  const galleryId = { "31": "gallery-33", "32": "gallery-34" }[serviceId ?? ""];
  return galleries.find((g) => g.id === galleryId)?.photos ?? [];
}

/** Photos de la section « Notre galerie photos » : toute la galerie, par lignes de 4. */
export function realisationPhotos(page: PageData): Photo[] {
  const base = page.sections.realisations ?? [];
  const seen = new Set(base.map((p) => p.large));
  const extra = galleries.flatMap((g) => g.photos).filter((p) => !seen.has(p.large));
  const all = [...base, ...extra];
  return all.slice(0, Math.floor(all.length / 4) * 4 || all.length);
}

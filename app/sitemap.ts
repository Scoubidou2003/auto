import type { MetadataRoute } from "next";
import { getAllRoutes } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllRoutes().map((route) => ({
    url: SITE_URL + route,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));
}

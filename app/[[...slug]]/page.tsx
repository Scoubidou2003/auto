import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllRoutes, getPage } from "@/lib/content";
import SiteShell from "@/components/SiteShell";
import { fillContactText, getContact } from "@/lib/contact";

// Seules les pages issues du site d'origine existent : le reste renvoie une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRoutes().map((route) => ({
    slug: route === "/" ? undefined : route.slice(1).split("/"),
  }));
}

function routeFromParams(slug?: string[]) {
  return slug?.length ? "/" + slug.join("/") : "/";
}

export async function generateMetadata({ params }: PageProps<"/[[...slug]]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(routeFromParams(slug));
  if (!page) return {};
  const contact = await getContact();
  const title = fillContactText(page.title, contact);
  const description = fillContactText(page.description, contact);
  const images = page.ogImage ? [page.ogImage] : undefined;
  return {
    title,
    description,
    alternates: { canonical: page.route },
    openGraph: { title, description, url: page.route, images },
    twitter: { title, description, images },
  };
}

export default async function Page({ params }: PageProps<"/[[...slug]]">) {
  const { slug } = await params;
  const page = getPage(routeFromParams(slug));
  if (!page) notFound();
  const contact = await getContact();
  return <SiteShell page={page} contact={contact} />;
}

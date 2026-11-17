/* eslint-disable @next/next/no-css-tags -- CSS d'origine servi tel quel depuis public/ pour garder sa cascade */
import type { Metadata, Viewport } from "next";
import { site } from "@/lib/content";
import Lightbox from "@/components/Lightbox";
import ContactProvider from "@/components/ContactProvider";
import CallButton from "@/components/CallButton";
import { getContact } from "@/lib/contact";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.piecesautodulin.com"),
  title: site.name,
  icons: { icon: site.icons.favicon },
  openGraph: { siteName: site.name, locale: "fr_FR", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

/*
 * Feuilles de style d'origine du site, servies telles quelles depuis public/
 * (seuls les chemins des images et polices ont été réécrits).
 * L'ordre reproduit la cascade du site d'origine.
 */
const STYLESHEETS = [
  "/css/inline-before.css",
  "/theme.min.css",
  "/themes/themefd5380/css/style.min.css",
  "/themes/themefd5380/css/gbp.css",
  "/includes/fontawesome/css/all.min.css",
  "/css/inline-after.css",
  "/css/next-additions.css",
];

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Téléphone et e-mail lus dans les variables d'environnement à chaque requête
  const contact = await getContact();
  return (
    <html lang="fr">
      <head>
        {STYLESHEETS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <link rel="stylesheet" href="/themes/themefd5380/css/print.min.css" media="print" />
      </head>
      <body>
        <ContactProvider value={contact}>
          {children}
          <CallButton />
        </ContactProvider>
        <Lightbox />
      </body>
    </html>
  );
}

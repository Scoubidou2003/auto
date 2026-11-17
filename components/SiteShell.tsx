import Link from "next/link";
import type { PageData } from "@/lib/content";
import type { Contact } from "@/lib/contact";
import { realisationPhotos, site } from "@/lib/content";
import Banner from "./Banner";
import MobileNav from "./MobileNav";
import SurBanniere from "./SurBanniere";
import RichContent from "./RichContent";
import ServicesBlock from "./ServicesBlock";
import PhotoGrid from "./PhotoGrid";
import GmbBlock from "./GmbBlock";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";

/**
 * Gabarit commun à toutes les pages, reprenant la structure HTML du site d'origine
 * (mêmes classes CSS) pour conserver le design à l'identique.
 * La classe qui était posée sur <body> est portée par le conteneur racine.
 */
export default function SiteShell({ page, contact }: { page: PageData; contact: Contact }) {
  const active = page.activeMenu;
  return (
    <div className={page.bodyClass}>
      <div className="main-page">
        <Banner image={page.bannerImage} />
        <MobileNav key={page.route} active={active} />

        <header className="hide-print tete hidden-xs hidden-sm">
          <p className="logo-site">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.logo} width={413} height={62} alt={site.name} />
            </Link>
          </p>
          <nav className="navh">
            <ul id="menu_principal" className="menu_principal">
              {site.mainMenu.map((item) => (
                <li key={item.href} className={`menu-item${item.href === active ? " active" : ""}`}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="fluid-contenu">
          <SurBanniere titre={page.slogan.titre} sousTitre={page.slogan.sousTitre} />
          <div className="corps">
            <RichContent page={page} contact={contact} />
          </div>
        </main>

        {page.sections.services && <ServicesBlock />}

        {page.sections.realisations && (
          <div className="realisations">
            <div className="contenu">
              <h2 className="h1 sans-image">
                Notre galerie photos <span className="titre-secondaire"> </span>
              </h2>
              <PhotoGrid
                className="row galerie"
                colClassName="col-md-3 col-sm-3 col-xs-6"
                group="galerie-accueil"
                photos={realisationPhotos(page)}
              />
            </div>
          </div>
        )}

        {page.sections.gmbImage && <GmbBlock image={page.sections.gmbImage} />}

        <Footer showForm={page.footerForm} active={active} contact={contact} />
        <ScrollTop />
      </div>
    </div>
  );
}

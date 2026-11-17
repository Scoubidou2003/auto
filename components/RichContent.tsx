import Link from "next/link";
import parse, { domToReact, Element, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import type { PageData } from "@/lib/content";
import { fillContactHtml, type Contact } from "@/lib/contact";
import { photosForPage, photosForService } from "@/lib/content";
import ContactForm from "./ContactForm";
import PhotoGrid from "./PhotoGrid";
import PhoneReveal from "./PhoneReveal";
import GalleryTabs from "./GalleryTabs";

const isInternalPage = (href: string) => href.startsWith("/") && !/\.[a-z0-9]+(#.*)?$/i.test(href);

const hasClass = (el: Element, cls: string) => (el.attribs.class ?? "").split(/\s+/).includes(cls);

const elementChildren = (el: Element) => el.children.filter((c): c is Element => c instanceof Element);

/**
 * Affiche le contenu HTML d'une page du site d'origine en le convertissant en
 * composants React : liens internes -> <Link>, formulaire -> <ContactForm>, etc.
 */
export default function RichContent({ page, contact }: { page: PageData; contact: Contact }) {
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return;
      const { name, attribs } = node;

      // <meta> présents dans le corps des pages d'origine : inutiles ici
      if (name === "meta") return <></>;

      // Formulaire de contact
      if (attribs["data-contact-form"]) {
        const kind = attribs["data-contact-form"];
        return <ContactForm layout={kind === "contact" ? "stacked" : "split"} compact={kind === "pageseo"} />;
      }

      // Photos ajoutées sur les pages qui n'en avaient pas
      if (attribs["data-photos"] === "seo") {
        return (
          <PhotoGrid
            className="row recup-photos retrait photos-seo"
            colClassName="col-md-4 col-sm-4 col-xs-4"
            group="photos-page"
            photos={photosForPage(page)}
          />
        );
      }
      if (attribs["data-photos"] === "service") {
        const serviceId = page.bodyClass.match(/body-service-(\d+)/)?.[1];
        return (
          <PhotoGrid
            className="row ligne-photos photos-service"
            colClassName="col-md-4 col-sm-4 col-xs-6 nopad"
            group={`gallery-image-${serviceId}`}
            photos={photosForService(page)}
            variant="figure"
          />
        );
      }

      // Numéro de téléphone masqué (« Afficher le numéro »)
      if (name === "p" && hasClass(node, "callTracker")) {
        return <PhoneReveal className={attribs.class} withTexte={false} />;
      }

      // Galerie à onglets
      if (name === "div" && hasClass(node, "multiple") && node.attribs.class?.includes("row")) {
        const tabs = findAll(node, (e) => e.name === "a" && e.attribs["data-toggle"] === "tab").map((a) => ({
          id: a.attribs.href.replace("#", ""),
          label: textOf(a),
        }));
        const content = elementChildren(node).find((c) => hasClass(c, "tab-content"));
        const panes = content
          ? elementChildren(content)
              .filter((c) => hasClass(c, "tab-pane"))
              .map((pane) => ({
                id: pane.attribs.id,
                content: domToReact(pane.children as DOMNode[], options),
              }))
          : [];
        return <GalleryTabs tabs={tabs} panes={panes} />;
      }

      // Liens internes : navigation côté client
      if (name === "a" && attribs.href && isInternalPage(attribs.href) && !attribs["data-lightbox"]) {
        const { href, class: className, target, title, rel } = attribs;
        return (
          <Link href={href} className={className} target={target} title={title} rel={rel}>
            {domToReact(node.children as DOMNode[], options)}
          </Link>
        );
      }
    },
  };

  // Le numéro et l'e-mail du contenu viennent des variables d'environnement (liens cliquables)
  return <>{parse(fillContactHtml(page.corpsHtml, contact), options)}</>;
}

function findAll(el: Element, pred: (e: Element) => boolean): Element[] {
  const out: Element[] = [];
  for (const c of el.children) {
    if (!(c instanceof Element)) continue;
    if (pred(c)) out.push(c);
    out.push(...findAll(c, pred));
  }
  return out;
}

function textOf(el: Element): string {
  return el.children
    .map((c) => ("data" in c && typeof c.data === "string" ? c.data : c instanceof Element ? textOf(c) : ""))
    .join("")
    .trim();
}

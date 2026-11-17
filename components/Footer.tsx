import Link from "next/link";
import { site } from "@/lib/site";
import ContactForm from "./ContactForm";
import PhoneReveal from "./PhoneReveal";
import SocialIcons from "./SocialIcons";
import type { Contact } from "@/lib/contact";

type Props = { showForm: boolean; active: string | null; contact: Contact };

export default function Footer({ showForm, active, contact }: Props) {
  const year = new Date().getFullYear();
  const copyright = (
    <>
      © {year} {site.legalName}
    </>
  );

  return (
    <footer className="hide-print pied">
      <div className="bande1">
        {showForm && (
          <div className="row row1">
            <div className="contact" id="contact-form">
              <div className="formulaire contact-footer">
                <h2 className="h1">Une question ?</h2>
                <div className="row paddingContact">
                  <ContactForm layout="split" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bande2">
        <div className="row">
          <div className="col-md-3 trait1 nopad navf col-sm-6">
            <h3>Accès rapide</h3>
            <ul id="menu_footer" className="menu_footer">
              {site.footerMenu.map((item) => (
                <li key={item.href} className={`menu-item${item.href === active ? " active" : ""}`}>
                  <Link href={item.href} title={item.label}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="copyright-footer visible-lg">{copyright}</p>
          </div>
          <div className="col-md-4 trait2 col-sm-6 nopad">
            <h3>Contactez-nous</h3>
            <address>
              <p className="adresse">
                <span>Adresse : </span> <span className="texte">{site.address.street}</span>
                <br /> <span className="texte">{site.address.zip}</span> <span className="texte">{site.address.city}</span>
              </p>
              <PhoneReveal className="tel tel1 callTracker" />
              {contact.email && (
                <p className="email">
                  <span>E-mail : </span>
                  <a className="texte" href={contact.emailHref}>
                    {contact.email}
                  </a>
                </p>
              )}
            </address>
            <SocialIcons className="reseaux-sociaux reseaux-footer" />
          </div>
          <div className="col-md-5 col-sm-12 nopad">
            <h3>Recherches fréquentes</h3>
            <div className="scrollbars">
              <ul id="menu_referencement" className="menu_referencement">
                {site.seoMenu.map((item) => (
                  <li key={item.href} className="menu-item">
                    <Link href={item.href} title={item.label}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="clearfix" />
            </div>
          </div>
        </div>
        <div className="row">
          <p className="copyright-footer hidden-lg">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

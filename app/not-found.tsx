import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="body-error404">
      <div className="main-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} width={413} height={62} alt={site.name} style={{ maxWidth: "100%", height: "auto" }} />
          <h1>Page introuvable</h1>
          <p>La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
          <Link href="/" className="bouton-principal hvr-shutter-out-horizontal">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

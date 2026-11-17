import { site } from "@/lib/site";

/** Bandeau « Partagez votre expérience sur notre fiche Google ». */
export default function GmbBlock({ image }: { image: string }) {
  const { note, width, url } = site.googleReviews;
  return (
    <div className="bloc-GMB" style={{ backgroundImage: `url(${image})` }}>
      <div className="contain-GMB">
        <h2 className="h1">Partagez votre expérience sur notre fiche Google</h2>
        <div className="note-avis">
          <span className="nbr-note">{note}</span>
          <div className="zone-etoiles-note">
            <span className="etoiles-2" style={{ width }} />
          </div>
        </div>
        <p>Note globale sur les avis clients sur notre fiche.</p>
        <a href={url} target="_blank" rel="noopener" className="bouton-principal hvr-shutter-out-horizontal">
          {" "}
          Partagez-nous votre expérience
        </a>
      </div>
    </div>
  );
}

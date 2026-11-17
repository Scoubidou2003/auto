import type { Photo } from "@/lib/content";

type Props = {
  photos: Photo[];
  group: string;
  className: string;
  colClassName: string;
  /** "span" : vignette en fond (accueil, galerie) ; "figure" : variante des fiches galerie / services */
  variant?: "span" | "figure";
};

/** Grille de vignettes cliquables (ouvertes dans la visionneuse via data-lightbox). */
export default function PhotoGrid({ photos, group, className, colClassName, variant = "span" }: Props) {
  return (
    <div className={className}>
      {photos.map((photo) => {
        const link = (
          <a className="imagecont noflicker" title={photo.title} href={photo.large} data-lightbox={group}>
            <span className="imagefond cover transition" style={{ backgroundImage: `url(${photo.medium})` }} />
            <span className="masque transition" />
          </a>
        );
        return (
          <div key={photo.large} className={colClassName}>
            <div className="propor">
              {variant === "figure" ? (
                <figure className="propor-cont">
                  {link}
                  <figcaption className="hide">{photo.title}</figcaption>
                </figure>
              ) : (
                <div className="propor-cont">{link}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

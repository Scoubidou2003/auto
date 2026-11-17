"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { site } from "@/lib/site";

type Layout = "split" | "stacked";
type Status = { type: "idle" | "sending" | "success" | "error"; message?: string };

function Group({ id, label, required, children }: { id?: string; label?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="form-group">
      <label className="control-label col-md-4" htmlFor={id}>
        {required && <span className="required">* </span>}
        {label}
      </label>
      <div className="col-md-8">{children}</div>
    </div>
  );
}

/**
 * Formulaire « Contactez-nous », identique à celui du site d'origine.
 * `split` : deux colonnes (pied de page et pages SEO) ; `stacked` : une colonne (page Contact).
 * `compact` : sans les listes « intéressé(e) par » / « comment nous avez-vous connus » (pages SEO).
 */
export default function ContactForm({ layout, compact = false }: { layout: Layout; compact?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `contact-${uid}-${n}`;
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ type: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, page: window.location.pathname }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Une erreur est survenue, merci de réessayer plus tard.");
      form.reset();
      setStatus({ type: "success", message: "Merci, votre message a bien été envoyé. Nous vous recontacterons rapidement." });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }

  const left = (
    <>
      <Group id={id("societe")} label="Société">
        <input type="text" className="form-control input-md col-md-8" name="societe" placeholder="Société" id={id("societe")} />
      </Group>
      <Group id={id("civilite")} label="Civilité">
        <select name="civilite" className="form-control input-md col-md-8" id={id("civilite")} aria-label="Civilité" defaultValue="">
          <option value="">Civilité</option>
          <option value="M.">M.</option>
          <option value="Mme">Mme</option>
          <option value="Mlle">Mlle</option>
        </select>
      </Group>
      <Group id={id("nom")} label="Nom" required>
        <input type="text" className="form-control input-md col-md-8" name="nom" required placeholder="Nom *" id={id("nom")} />
      </Group>
      <Group id={id("prenom")} label="Prénom">
        <input type="text" className="form-control input-md col-md-8" name="prenom" placeholder="Prénom " id={id("prenom")} />
      </Group>
      <Group id={id("tel")} label="Téléphone" required>
        <input type="tel" name="tel" className="form-control input-md col-md-8" required placeholder="Téléphone *" id={id("tel")} />
      </Group>
      <Group id={id("email")} label="Courriel" required>
        <input type="email" name="email" className="form-control input-md col-md-8" required placeholder="Courriel *" id={id("email")} />
      </Group>
    </>
  );

  const selects = compact ? null : (
    <>
      <Group id={id("interet")}>
        <select name="interesstedby" className="form-control input-md col-md-8" id={id("interet")} aria-label="Je suis intéressé(e) par" defaultValue="">
          <option value="">Je suis intéressé(e) par</option>
          <option value="Vente de pièces d'occasion">Vente de pièces d&apos;occasion</option>
          <option value="Rachat d’épaves">Rachat d’épaves</option>
          <option value="Autres">Autres</option>
        </select>
      </Group>
      <Group id={id("referrer")}>
        <select name="referrer" className="form-control input-md col-md-8" id={id("referrer")} aria-label="Comment nous avez-vous connus ?" defaultValue="">
          <option value="">Comment nous avez-vous connus ?</option>
          <option value="Moteur de recherche">Moteur de recherche</option>
          <option value="Bouche à oreille">Bouche à oreille</option>
          <option value="Courriel">Courriel</option>
          <option value="Publicité papier">Publicité papier</option>
          <option value="Presse">Presse</option>
        </select>
      </Group>
    </>
  );

  const right = (
    <>
      {selects}
      <Group id={id("message")} label="Message" required>
        <textarea rows={5} name="message" className="form-control input-md col-md-8" required style={{ resize: "none" }} placeholder="Message *" id={id("message")} />
      </Group>
      <div className="form-group">
        <label className="control-label col-md-4">Consentement RGPD</label>
        <div className="col-md-12">
          <label className="checkbox label-rgpd">
            <p>
              Les informations recueillies font l’objet d’un traitement informatique destiné à<em>&nbsp;{site.legalName}</em>,
              responsable du traitement, afin de donner suite à votre demande et de vous recontacter. Conformément à la réglementation
              en vigueur, vous disposez notamment d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et d&apos;effacement
              sur les données personnelles qui vous concernent. Pour plus d’informations, cliquez&nbsp;
              <Link href="/politique-de-confidentialite">ici</Link>.
            </p>
          </label>
        </div>
      </div>
      {/* Champ piège anti-robots, invisible pour les visiteurs */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-group">
        <div className="col-md-8">
          <input type="submit" value={status.type === "sending" ? "Envoi…" : "Envoyer"} disabled={status.type === "sending"} className="btn btn-primary" />
        </div>
      </div>
      <div className="form-group">
        <div className="form-actions col-md-12">
          <span className="required">* </span> Champs obligatoires
        </div>
      </div>
    </>
  );

  const alert =
    status.type === "success" || status.type === "error" ? (
      <div className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
        {status.message}
      </div>
    ) : null;

  return (
    <>
      {alert}
      <form onSubmit={onSubmit} method="post" className="form-horizontal" noValidate={false}>
        {layout === "split" ? (
          <div className="row">
            <div className="formulaire gauche col-md-6 nopad-l nopad-sm nopad-xs">
              <fieldset>{left}</fieldset>
            </div>
            <div className="formulaire droite col-md-6 nopad-r nopad-sm nopad-xs">{right}</div>
          </div>
        ) : (
          <fieldset>
            {left}
            {right}
          </fieldset>
        )}
      </form>
    </>
  );
}

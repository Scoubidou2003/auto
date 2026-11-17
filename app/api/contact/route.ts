import nodemailer from "nodemailer";
import { site } from "@/lib/site";
import { readContact } from "@/lib/contact";

/**
 * Réception du formulaire de contact.
 *
 * L'envoi d'e-mail se configure par variables d'environnement (voir .env.example) :
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM.
 * Sans CONTACT_TO, les demandes sont envoyées à l'adresse SITE_EMAIL.
 * Sans configuration SMTP, la demande est seulement écrite dans les journaux du serveur.
 */

type Payload = Record<string, unknown>;

const FIELDS: [key: string, label: string][] = [
  ["societe", "Société"],
  ["civilite", "Civilité"],
  ["nom", "Nom"],
  ["prenom", "Prénom"],
  ["tel", "Téléphone"],
  ["email", "Courriel"],
  ["interesstedby", "Intéressé(e) par"],
  ["referrer", "Nous a connus par"],
  ["message", "Message"],
  ["page", "Page d'envoi"],
];

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège rempli : robot, on fait comme si tout allait bien
  if (str(body.website)) return Response.json({ ok: true });

  const data = Object.fromEntries(FIELDS.map(([k]) => [k, str(body[k])]));
  const missing = [
    ["nom", "le nom"],
    ["tel", "le téléphone"],
    ["email", "le courriel"],
    ["message", "le message"],
  ].filter(([k]) => !data[k]);
  if (missing.length) {
    return Response.json({ error: `Merci de renseigner ${missing.map(([, l]) => l).join(", ")}.` }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return Response.json({ error: "L'adresse e-mail n'est pas valide." }, { status: 400 });
  }

  const text = FIELDS.filter(([k]) => data[k])
    .map(([k, label]) => `${label} : ${data[k]}`)
    .join("\n");

  const contact = readContact();
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_FROM } = process.env;
  const CONTACT_TO = process.env.CONTACT_TO || contact.email;
  if (!SMTP_HOST || !CONTACT_TO) {
    console.info(`[contact] Nouvelle demande (SMTP non configuré, e-mail non envoyé) :\n${text}`);
    return Response.json({ ok: true });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    await transporter.sendMail({
      from: CONTACT_FROM || SMTP_USER || CONTACT_TO,
      to: CONTACT_TO,
      replyTo: data.email,
      subject: `[${site.name}] Demande de contact de ${[data.prenom, data.nom].filter(Boolean).join(" ")}`,
      text,
    });
  } catch (err) {
    console.error("[contact] Échec de l'envoi :", err);
    return Response.json(
      {
        error: contact.phone
          ? `L'envoi a échoué. Vous pouvez nous écrire directement sur WhatsApp au ${contact.phone}.`
          : "L'envoi a échoué. Merci de réessayer plus tard.",
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}

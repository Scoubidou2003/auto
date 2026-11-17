# PIÈCES AUTO DULIN — site Next.js

Version Next.js (App Router) du site www.piecesautodulin.fr. Le design et les photos sont ceux du site d'origine.

## Démarrer

```bash
npm install
npm run dev        # développement : http://localhost:3000
npm run build      # compilation
npm start          # serveur de production
```

## WhatsApp, e-mail et réseaux sociaux (variables d'environnement)

Ces coordonnées ne sont pas écrites dans le code : elles viennent de `.env.local` (modèle dans `.env.example`).

```bash
SITE_PHONE=+33 645 12 59 75                     # numéro WhatsApp, format international
SITE_WHATSAPP_MESSAGE=Bonjour, je souhaite acheter une pièce auto.   # facultatif
SITE_EMAIL=pieceautodulin802@gmail.com
SITE_FACEBOOK_URL=https://www.facebook.com/share/1TgHRg9kJb/
SITE_TIKTOK_URL=https://www.tiktok.com/@pice.auto.dulin0
```

- Le garage n'est joignable que par **WhatsApp**. Partout, le numéro ouvre une conversation WhatsApp (`https://wa.me/…`) avec le message pré-rempli : bouton flottant « Acheter une pièce », icônes en haut des pages, « Afficher le numéro », menu mobile et tous les numéros cités dans le texte (affichés avec le logo WhatsApp). La mention « Joignable uniquement sur WhatsApp » accompagne le numéro.
- `SITE_EMAIL` est affiché dans le pied de page et sur la page contact, et sert au bouton « Envoyer un email » du menu mobile. Il reçoit aussi les demandes du formulaire si `CONTACT_TO` est vide.
- `SITE_FACEBOOK_URL` et `SITE_TIKTOK_URL` alimentent les icônes des réseaux sociaux (haut de page, menus mobiles, pied de page). Une variable vide masque l'icône correspondante.
- Pour changer une valeur, la modifier puis redémarrer le serveur (`npm start`) : pas besoin de recompiler. Les pages sont rendues à chaque requête pour toujours afficher la valeur actuelle.
- Dans le contenu (`content/pages/*.json`, `content/llms.txt`), le numéro et l'e-mail s'écrivent `{{TELEPHONE}}` et `{{EMAIL}}`.

## Formulaire de contact

Renseigner les variables SMTP de `.env.example` dans `.env.local` pour l'envoi des e-mails. Sans configuration SMTP, les demandes reçues sont seulement écrites dans les journaux du serveur.

## Organisation

| Dossier | Contenu |
| --- | --- |
| `app/[[...slug]]/page.tsx` | Route unique qui sert toutes les pages (accueil, services, galerie, contact, 133 pages SEO…) |
| `app/api/contact/route.ts` | Réception du formulaire de contact et envoi par e-mail (nodemailer) |
| `components/` | Gabarit (`SiteShell`), en-tête, menus mobiles, formulaire, visionneuse photo, diaporama… |
| `content/pages/*.json` | Contenu de chaque page (titre, description, slogan, texte HTML) |
| `content/site.json` | Adresse, menus, liens communs |
| `lib/contact.ts` | Lecture des variables `SITE_*` (WhatsApp, e-mail, réseaux sociaux) et remplacement des marqueurs `{{TELEPHONE}}` / `{{EMAIL}}` |
| `public/` | CSS, polices et images d'origine (noms de fichiers d'origine) |

Les anciennes adresses en `.html` redirigent définitivement (308) vers les nouvelles adresses sans extension, pour conserver le référencement.

## Modifier le contenu

- **Texte d'une page** : modifier `corpsHtml` dans `content/pages/<page>.json`.
- **WhatsApp, e-mail, réseaux sociaux** : variables `SITE_*` (voir plus haut).
- **Adresse, menus** : `content/site.json`.
- **Ajouter des photos à la galerie** : déposer les images dans `public/images/gallery/medium/` (vignette) et `large/` (grand format), puis les déclarer dans `content/galleries.json`.

Le contenu de `content/` et les fichiers de `public/` ont été extraits une fois pour toutes du site d'origine : ce sont désormais eux qui font foi.

## Changements par rapport au site d'origine

- Photos ajoutées : 3 photos sur chaque page SEO (qui n'en avaient aucune), la galerie complète sur les fiches services, et 8 photos au lieu de 4 dans « Notre galerie photos ».
- Page « Qui sommes-nous ? » : absente de la copie HTTrack (erreur 403), récupérée directement sur le site en ligne.
- Retirés : traceurs (Google Analytics, Matomo, AWStats), bandeau cookies (devenu inutile sans traceurs), widget Facebook, reCAPTCHA (remplacé par un champ piège anti-robots) et logo de l'ancien hébergeur (remplacé par une mention de copyright).
- Vente de pièces via WhatsApp uniquement : bouton flottant « Acheter une pièce » sur toutes les pages, et numéros du texte cliquables (logo WhatsApp).
- Réseaux sociaux : Facebook et TikTok uniquement (les boutons de partage Twitter / e-mail / Google ont été retirés du haut de page ; le bloc d'avis Google en bas de l'accueil est conservé).
- Le JavaScript jQuery a été réécrit en composants React (menus mobiles, diaporama, visionneuse, onglets, « Afficher le numéro », bouton « Haut du site »).

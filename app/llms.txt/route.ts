import fs from "node:fs";
import path from "node:path";
import { fillContactText, readContact } from "@/lib/contact";

/** /llms.txt : résumé du site pour les IA, avec les coordonnées actuelles. */
export function GET() {
  const source = fs.readFileSync(path.join(process.cwd(), "content", "llms.txt"), "utf8");
  return new Response(fillContactText(source, readContact()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

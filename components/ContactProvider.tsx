"use client";

import { createContext, useContext } from "react";
import { EMPTY_CONTACT, type Contact } from "@/lib/contact-shared";

const ContactContext = createContext<Contact>(EMPTY_CONTACT);

/** Transmet aux composants clients les coordonnées lues côté serveur (variables d'environnement). */
export default function ContactProvider({ value, children }: { value: Contact; children: React.ReactNode }) {
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export const useContact = () => useContext(ContactContext);

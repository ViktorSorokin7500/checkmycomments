import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import React from "react";

interface ContactsProps {
  lang: Locale;
}

const Contacts: React.FC<ContactsProps> = async ({ lang }) => {
  const dictionary = await getDictionary(lang);
  return <div>{dictionary.contacts.title}</div>;
};

export default Contacts;

import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import React from "react";

const Contacts = async ({ params: { lang } }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(lang);
  return <div>{dictionary.contacts.title}</div>;
};

export default Contacts;

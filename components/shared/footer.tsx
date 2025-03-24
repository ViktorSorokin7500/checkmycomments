import { Locale } from "@/i18n.config";
import Link from "next/link";

// async function getDictionary(lang: Locale) {
//   const dictionary = await import(`@/dictionaries/${lang}.json`);
//   return dictionary.default;
// }

export async function Footer({ lang }: { lang: Locale }) {
  console.log(lang);

  return (
    <footer className="bg-gradient-to-r from-green-500 via-lime-500 to-green-500 py-4 text-white flex flex-col md:flex-row gap-2 justify-between items-center px-6">
      <Link href="mailto:viktoriosecret@gmail.com" className="hover:underline">
        viktoriosecret@gmail.com
      </Link>
      <Link href="tel:+380991241055" className="hover:underline">
        +380991241055 (Viber, WhatsApp, Telegram)
      </Link>
      <p>© 2025 Віктор Сорокін</p>
    </footer>
  );
}

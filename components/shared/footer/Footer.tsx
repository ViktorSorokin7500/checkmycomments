import React from "react";
import { FaTelegram, FaViber, FaWhatsapp } from "react-icons/fa"; // Іконки з react-icons

interface FooterProps {
  t: string;
}

export async function Footer({ t }: FooterProps) {
  return (
    <footer className="pt-8 bg-soft-fog/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-soft-fog/20 backdrop-blur-md rounded-t-lg shadow-lg py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in-delay">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold text-lime-zest mb-2">{t}</h3>
            <p className="text-lg text-bright-snow">
              <a
                href={`mailto:viktoriosecret@gmail.com`}
                className="hover:text-lime-zest transition-colors"
              >
                viktoriosecret@gmail.com
              </a>
            </p>
            <p className="text-lg text-bright-snow">+38 (099) 124-10-55</p>
          </div>

          {/* Іконки месенджерів */}
          <div className="flex gap-4">
            <a
              href="https://t.me/+380991241055"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-night hover:text-sky-400 transition-colors"
            >
              <FaTelegram size={28} />
            </a>
            <a
              href="viber://chat?number=+380991241055"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-night hover:text-purple-500 transition-colors"
            >
              <FaViber size={28} />
            </a>
            <a
              href="https://wa.me/+380991241055"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-night hover:text-lime-zest transition-colors"
            >
              <FaWhatsapp size={28} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

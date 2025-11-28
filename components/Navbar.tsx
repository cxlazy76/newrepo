"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const Logo = () => (
  <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
    <span className="text-[#E5FF00] drop-shadow-sm">AI</span> Greetings
  </h3>
);

const NavLinks = [
  { name: "How It Works", href: "/how-it-works" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" }
];

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-lg">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Logo />
        </div>

        <nav className="hidden lg:flex items-center space-x-8 text-base font-medium">
          {NavLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={closeMenu}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 underline-offset-[6px] hover:underline"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <motion.button
          onClick={() => {
            router.push("/characters");
            closeMenu();
          }}
          className="hidden lg:block px-6 py-2.5 rounded-full bg-gray-900 text-white font-semibold text-[15px] transition-all duration-300 ease-out shadow-md hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          Generate Video
        </motion.button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none z-50"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
          closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeIn" } }
        }}
        className="lg:hidden overflow-hidden border-t border-gray-100 bg-white"
        style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
      >
        <div className="px-4 py-4 space-y-2 text-base font-medium">
          {NavLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={closeMenu}
              className="block w-full py-3 px-3 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              {item.name}
            </a>
          ))}

          <motion.button
            onClick={() => {
              router.push("/characters");
              closeMenu();
            }}
            className="mt-4 w-full px-5 py-3 rounded-xl bg-[#E5FF00] text-gray-900 font-bold text-[16px] hover:bg-[#D4EE00]"
          >
            Generate Video
          </motion.button>
        </div>
      </motion.div>
    </header>
  );
}

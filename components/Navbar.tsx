"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-16 sm:h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* --- LOGO SECTION --- */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer no-underline group z-50 relative">
           <span className="font-[900] tracking-tight text-xl sm:text-2xl text-gray-900">
             RoastYourFriend.com
           </span>
        </Link>

        {/* --- DESKTOP LINKS --- */}
        <div className="hidden md:flex items-center gap-8">
            {/* UPDATED: Added '/' before '#' to navigate to home page first */}
            <Link href="/#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">
              How it Works
            </Link>
            
            <Link href="/characters" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">
              Characters
            </Link>
            
            {/* UPDATED: Added '/' before '#' */}
            <Link href="/#contact-us" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">
              Support
            </Link>
        </div>

        {/* --- MENU BUTTON (Hamburger) --- */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 overflow-hidden shadow-sm md:hidden"
          >
            <div className="flex flex-col p-6 gap-6 text-center">
              {/* UPDATED: Added '/' before '#' */}
              <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-900">
                How it Works
              </Link>
              
              <Link href="/characters" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-900">
                Characters
              </Link>
              
              {/* UPDATED: Added '/' before '#' */}
              <Link href="/#contact-us" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-900">
                Support
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
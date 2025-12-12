"use client";

import React, { useState } from "react";
// UPDATED: Fixed import paths to go up 3 levels
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // Ensure Link is imported

// --- FAQ Data ---
const FAQ_DATA = [
  {
    category: "General",
    items: [
      { q: "What exactly is RoastYourFriend?", a: "It's an AI-powered platform that lets you create hilarious, personalized video greetings using famous characters. You pick a character, type a script, and our AI generates a video of them saying exactly what you wrote." },
      { q: "How long does it take to generate?", a: "Most videos are generated in 30-60 seconds. During high traffic times, it might take a couple of minutes." },
      { q: "Is it real audio?", a: "We use advanced AI voice cloning technology to make the characters sound incredibly realistic, but it is 100% AI-generated." },
    ]
  },
  {
    category: "Pricing & Payment",
    items: [
      { q: "Is it free?", a: "You can preview characters for free! To download the final high-quality video without watermarks, there is a small one-time fee per video." },
      { q: "Can I get a refund?", a: "Yes! If the AI produces a glitchy or defective video (e.g., no audio, warped face), just email us and we'll refund you or regenerate it for free." },
      { q: "What payment methods do you accept?", a: "We accept all major credit cards, Apple Pay, and Google Pay via Stripe." },
    ]
  },
  {
    category: "Privacy",
    items: [
      { q: "Do you keep my photos?", a: "No. Photos uploaded for face-swapping features are processed instantly and deleted from our servers shortly after generation." },
      { q: "Will my video be public?", a: "No. Your generated videos are private to you unless you choose to share them." },
    ]
  }
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left font-bold text-gray-900 hover:text-gray-600 transition-colors"
      >
        <span className="text-lg">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      {/* Added top padding to clear fixed header */}
      <main className="flex flex-col items-center bg-white text-gray-900 font-sans min-h-screen pt-32 sm:pt-40 pb-20">
        <div className="w-full max-w-3xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-[900] tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-xl mx-auto">
              Everything you need to know about creating the perfect roast.
            </p>
          </div>

          <div className="space-y-12">
            {FAQ_DATA.map((section, i) => (
              <div key={i}>
                <h3 className="text-xl font-[900] uppercase tracking-wider text-gray-400 mb-4 ml-1">
                  {section.category}
                </h3>
                <div className="bg-white border-2 border-gray-100 rounded-3xl px-8 shadow-sm">
                  {section.items.map((item, j) => (
                    <FAQItem key={j} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center bg-gray-50 rounded-3xl p-10">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-8">We're happy to help you with anything you need.</p>
            {/* Updated Link to point to the correct contact page path */}
            <Link href="/support/contact">
              <button className="bg-[#E5FF00] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#D4EE00] transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer">
                Contact Support
                <Sparkles size={18} />
              </button>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
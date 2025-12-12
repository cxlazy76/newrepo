"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  onToggle: () => void;
}

export default function FAQItem({ question, answer, onToggle }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => {
      onToggle();
      return !prevIsOpen;
    });
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between py-4 text-left font-semibold text-gray-900 hover:text-gray-600 transition-colors"
      >
        <span className="text-sm sm:text-base">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              duration: 0.3,
            }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-gray-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
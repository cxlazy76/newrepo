"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import React, { useState, useCallback } from "react";

interface PaymentModalProps {
  onClose: () => void;
  message: string;
  characterId: string;
}

export default function PaymentModal({ onClose, message, characterId }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const price = "$3.99";

  const redirectToStripe = useCallback(async () => {
    if (!message || isProcessing) return;

    setIsProcessing(true);
    
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        character: characterId
      })
    });

    setIsProcessing(false);

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Stripe error");
    }
  }, [message, characterId, isProcessing]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Order
          </h3>
          <p className="text-gray-500 text-sm">
            One-time payment, secure checkout.
          </p>
          <div className="mt-6 flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-black">{price}</span>
            <span className="text-gray-500 font-medium">/ video</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={redirectToStripe}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-3 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            <span>{isProcessing ? "Processing..." : "Pay with Apple Pay"}</span>
          </button>

          <button
            onClick={redirectToStripe}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            <span>{isProcessing ? "Processing..." : "Pay with Card"}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Lock className="w-3 h-3" />
          <span>Payments processed securely by Stripe</span>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}
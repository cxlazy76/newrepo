"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center bg-white text-gray-900 font-sans min-h-screen py-20 sm:py-28 px-4">
        <div className="w-full max-w-3xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl font-[750] tracking-[-0.03em] mb-3">
              Refund Policy
            </h1>
            <p className="text-sm text-gray-500">
              Last Updated: 11.06.2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white rounded-3xl border-2 border-gray-200 p-6 sm:p-10 shadow-sm"
          >
            <p className="text-gray-700 mb-8 leading-relaxed text-lg">
              We want you to be happy with your videos. However, because we are generating digital goods that cost us computing power to create, our policy is a little different from a physical store.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">1. General Refund Policy</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Generally, <strong>we do not offer refunds</strong> for videos that have already been generated. Once the AI has done the work and the file is delivered, we can't "un-make" it.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">2. When We DO Issue Refunds</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  We are fair people. We will issue a refund if:
                </p>
                <ul className="list-disc ml-5 space-y-2 text-gray-600 leading-relaxed marker:text-gray-400">
                  <li><strong>Technical Failure:</strong> You paid, but the system crashed and you never got your video.</li>
                  {/* <li><strong>Double Charge:</strong> You accidentally clicked the button twice and were charged twice for the same thing.</li> */}
                  <li><strong>Quality Errors:</strong> The AI completely glitched (e.g., no audio, black screen) due to a bug on our end.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">3. Subscription Cancellation</h2>
                <p className="text-gray-600 leading-relaxed">
                  You can cancel your subscription at any time. The cancellation takes effect at the end of your current billing cycle. We do not offer prorated refunds for partially used months.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">How to Request Help</h2>
                <p className="text-gray-600">
                  If something went wrong, email us and we'll take a look. Please include your transaction ID or email used for purchase.<br/>
                  <br/>
                  <a href="mailto:contact@roastyourfriend.com" className="font-semibold text-black hover:text-[#D4EE00] transition-colors">contact@roastyourfriend.com</a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
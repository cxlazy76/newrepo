"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
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
              Terms of Service
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
              By using roastyourfriend.com, you agree to these terms. Ideally, we want everyone to have fun and make great videos, but we need some ground rules to keep things running smoothly.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">1. The Basics</h2>
                <ul className="list-disc ml-5 space-y-2 text-gray-600 leading-relaxed marker:text-gray-400">
                  <li>You must be at least 13 years old to use this site.</li>
                  <li>You are responsible for keeping your account details secure.</li>
                  <li>We provide the platform, but you are responsible for what you create with it.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">2. Acceptable Use (The "Don'ts")</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  We encourage creativity, but we draw the line at harm. You absolutely may not use our AI to generate:
                </p>
                <ul className="list-disc ml-5 space-y-2 text-gray-600 leading-relaxed marker:text-gray-400">
                  <li><strong>Hate Speech:</strong> Anything promoting violence, racism, or discrimination.</li>
                  <li><strong>Harassment:</strong> Content designed solely to bully or severely distress others.</li>
                  <li><strong>Impersonation:</strong> Trying to trick people into thinking you are a celebrity, politician, or someone else without permission.</li>
                  <li><strong>Illegal Acts:</strong> Anything that breaks the law in your jurisdiction.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Violation of these rules will result in an immediate ban without refund.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">3. AI & Content Ownership</h2>
                <ul className="list-disc ml-5 space-y-2 text-gray-600 leading-relaxed marker:text-gray-400">
                  <li><strong>You own your input:</strong> The scripts and text you write belong to you.</li>
                  <li><strong>You own the output:</strong> Once generated, you can use the video for personal or commercial purposes (unless you are on a restricted free plan).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">4. Payments & Cancellation</h2>
                <p className="text-gray-600 leading-relaxed">
                  Subscriptions renew automatically to keep your service uninterrupted. You can cancel anytime in your settings. If you cancel, your access continues until the end of your current billing period.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">5. Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  We provide the service "as is." While we strive for 99.9% uptime and perfect video quality, technology sometimes hiccups. We aren't liable for any damages or losses arising from your use of the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">Contact</h2>
                <p className="text-gray-600">
                  Need clarification on these rules? Email us: <br/>
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
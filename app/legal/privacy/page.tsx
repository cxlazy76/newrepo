"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
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
              We treat your data the way we’d want our own data treated: with respect and no surprises. This policy outlines what we collect, why we need it, and how we handle cookies.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">1. Information We Collect</h2>
                <ul className="list-disc ml-5 space-y-2 text-gray-600 leading-relaxed marker:text-gray-400">
                  <li><strong>Account Basics:</strong> If you sign up, we need your name and email to identify you.</li>
                  <li><strong>Your Inputs:</strong> We process the text, prompts, and media you upload to generate your videos. We don't use this for anything else.</li>
                  <li><strong>Usage Stats:</strong> We track how you navigate the site (e.g., which buttons you click) to figure out what's working and what's broken.</li>
                  <li><strong>Payment Details:</strong> We don't see your credit card number. That is handled entirely by our secure payment processor (like Stripe).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">2. How We Use It</h2>
                <p className="text-gray-600 leading-relaxed mb-3">We use your data to:</p>
                <ul className="list-disc ml-5 space-y-2 text-gray-600 leading-relaxed marker:text-gray-400">
                  <li>Actually generate the videos you asked for.</li>
                  <li>Send you your finished video files or download links.</li>
                  <li>Email you important stuff (like "Here is your receipt" or "We changed our terms"), not spam.</li>
                  <li>Keep the platform secure and prevent abuse.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">3. Cookie Policy</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Cookies are tiny text files that live in your browser. We use them to make the site work, not to follow you around the internet.
                </p>
                <ul className="list-disc ml-5 space-y-2 text-gray-600 leading-relaxed marker:text-gray-400">
                  <li><strong>Essential Cookies:</strong> These keep you logged in. Without them, the site breaks.</li>
                  <li><strong>Analytics Cookies:</strong> These tell us if lots of people are visiting from mobile phones or desktops, helping us decide what to build next.</li>
                  <li><strong>Control:</strong> You can block cookies in your browser settings at any time, though some parts of our site might stop working correctly.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">4. Who Sees Your Data?</h2>
                <p className="text-gray-600 leading-relaxed">
                  <strong>We do not sell your data.</strong> Ever. We only share it with the services necessary to run the business (like our hosting provider or payment processor) or if the law absolutely requires it.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">5. Your Rights</h2>
                <p className="text-gray-600 leading-relaxed">
                  It's your data. You have the right to ask for a copy of it, ask us to fix it, or ask us to delete it entirely. Just shoot us an email.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-[750] mb-3 text-black">Contact</h2>
                <p className="text-gray-600">
                  Questions? Concerns? Email us at: <br/>
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
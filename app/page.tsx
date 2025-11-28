"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Send } from "lucide-react";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Router = {
  push: (path: string) => void;
};

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
}

const useRouter = (): Router => {
  const mockPush = (path: string) => {
    console.log(`Maps: Attempting to navigate to ${path}`);
  };
  return { push: mockPush };
};

const useLogger = () => {
  useEffect(() => {
    console.log("LOG: View tracked for route /");
  }, []);
};

const SimpleImage: React.FC<SimpleImageProps> = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={className || "w-full h-full object-cover"} />;
};

const Logo = () => (
  <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
    <span className="text-[#E5FF00] drop-shadow-sm">AI</span> Greetings
  </h3>
);

export default function App() {
  const router = useRouter();
  useLogger();

  const videoUrls = [
    "https://placehold.co/300x600/E5FF00/121212?text=Video+1",
    "https://placehold.co/300x600/D4EE00/121212?text=Video+2",
    "https://placehold.co/300x600/C3DD00/121212?text=Video+3"
  ];

  const characterGridImageUrl = "https://placehold.co/1024x576/121212/ffffff?text=Character+Grid";
  const videoGenerationImageUrl = "https://placehold.co/1024x576/121212/ffffff?text=Instant+Video+Generation";

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center bg-white text-gray-900 font-sans">

        {/* HERO */}
        <section
          id="create-video"
          className="flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-12 pb-16 w-full max-w-7xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-[750] leading-tight max-w-4xl tracking-[-0.03em] mx-auto"
          >
            Generate <span className="text-black">personalized</span> AI greetings{" "}
            <span className="text-black">in seconds</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 inline-flex items-center gap-2 text-lg sm:text-xl text-gray-700 max-w-full"
          >
            Quickest and easiest platform - Takes less than 2 min
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={() => router.push("/characters")}
            className="mt-10 px-8 py-4 rounded-2xl bg-[#E5FF00] text-black font-semibold text-lg hover:bg-[#D4EE00] hover:shadow-[0_4px_10px_rgba(229,255,0,0.3)] transition-all"
          >
            Create your first video
          </motion.button>
        </section>

        {/* MOCK PHONE VIDEOS */}
        <section className="flex flex-col items-center justify-center pb-16 sm:pb-28 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full px-4 sm:px-6">
            {videoUrls.map((src, index) => {
              const rotations = ["rotate-[-1.5deg]", "rotate-[0.5deg]", "rotate-[-0.5deg]"];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.25,
                    duration: 0.9,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className={`rounded-3xl border-2 border-gray-200 overflow-hidden shadow-lg ${rotations[index]} w-full`}
                  style={{ aspectRatio: "9 / 16" }}
                >
                  <div className="w-full h-full object-cover flex items-center justify-center bg-gray-100">
                    <span className="text-gray-500 text-sm font-semibold">{`Mock ${index + 1}`}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <hr className="w-full max-w-7xl border-gray-200 my-8 sm:my-10" />

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="flex flex-col items-center justify-center pb-16 sm:pb-28 w-full max-w-7xl">
          <div className="w-full px-4 sm:px-6 space-y-10">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 text-base sm:text-xl text-gray-700 px-4 py-2 border border-gray-200 rounded-full bg-gray-50/50">
                <span>🔥</span>
                <span>Trusted by thousands of users worldwide</span>
                <span>🔥</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[750] text-center leading-tight tracking-[-0.03em]">
              <span className="text-black">100+</span>
              <br className="sm:hidden" /> Characters
              <br className="hidden sm:block" /> and The fastest way to create AI greetings
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 text-center max-w-3xl mx-auto">
              Watch the video below to see how it works.
            </p>

            <div className="relative aspect-video overflow-hidden bg-white shadow-xl w-full max-w-[52rem] mx-auto rounded-3xl border-2 border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all cursor-pointer">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="w-full max-w-7xl border-gray-200 my-8 sm:my-10" />

        {/* BLOG SECTION */}
        <section id="blog-section" className="flex flex-col items-center justify-center pb-16 sm:pb-28 w-full max-w-7xl">
          <div className="w-full px-4 sm:px-6 space-y-16 sm:space-y-20">

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[750] text-center leading-tight tracking-[-0.03em]">
              Latest News from the Blog
            </h2>

            {/* BLOG ITEM 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl font-[750] mb-4 sm:mb-6 leading-tight">Choose Your Perfect Character</h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Select from a diverse library of AI characters.
                </p>
              </div>

              <div className="flex-1 w-full max-w-lg order-1 lg:order-2">
                <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl">
                  <SimpleImage src={characterGridImageUrl} alt="Choose Your Perfect Character" fill className="object-cover absolute inset-0" />
                </div>
              </div>
            </div>

            {/* BLOG ITEM 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl font-[750] mb-4 sm:mb-6 leading-tight">Instant Video Generation</h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Our AI generates videos instantly.
                </p>
              </div>

              <div className="flex-1 w-full max-w-lg order-1 lg:order-2">
                <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl">
                  <SimpleImage src={videoGenerationImageUrl} alt="Instant Video Generation" fill className="object-cover absolute inset-0" />
                </div>
              </div>
            </div>

          </div>
        </section>

        <hr className="w-full max-w-7xl border-gray-200 my-8 sm:my-10" />

        {/* USERS TESTIMONIALS */}
        <section className="flex flex-col items-center justify-center pb-16 sm:pb-28 px-4 sm:px-6 w-full max-w-7xl">

          <div className="w-full max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-[750] text-center mb-10 sm:mb-12">Hear It From Our Users</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

              {/* CARD 1 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}</div>
                <h3 className="text-lg font-semibold mb-2">Game-changer for marketing</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">Transforms text into videos using AI.</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Sarah Johnson</p>
                    <p className="text-xs sm:text-sm text-gray-500">Marketing Director</p>
                  </div>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}</div>
                <h3 className="text-lg font-semibold mb-2">Streamlined our workflow</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">Streamlined workflow and improved content.</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Michael Chen</p>
                    <p className="text-xs sm:text-sm text-gray-500">Content Creator</p>
                  </div>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}</div>
                <h3 className="text-lg font-semibold mb-2">Incredible AI technology</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                  Technology moving fast with great results.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Emily Rodriguez</p>
                    <p className="text-xs sm:text-sm text-gray-500">CEO, StartupCo</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </section>

        <hr className="w-full max-w-7xl border-gray-200 my-8 sm:my-10" />

        {/* CONTACT SECTION */}
        <section id="contact-us" className="flex flex-col items-center justify-center pb-16 sm:pb-28 px-4 sm:px-6 w-full max-w-7xl">
          <div className="w-full max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-[750] text-center mb-4 sm:mb-6">Contact Us</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-10">Have questions or need support?</p>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-inner">
              <p className="text-gray-700 font-semibold mb-4">Send us an email:</p>

              <a
                href="mailto:support@aigreetings.com"
                className="text-lg font-bold text-gray-900 bg-[#E5FF00] hover:bg-[#D4EE00] py-3 px-6 rounded-xl inline-flex items-center gap-2 shadow-md"
              >
                <Send className="w-5 h-5" />
                support@aigreetings.com
              </a>

              <p className="mt-6 text-sm text-gray-500">We aim to respond within 24 hours.</p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section
          className="flex flex-col items-center justify-center pb-16 sm:pb-28 px-4 sm:px-6 w-full max-w-7xl"
        >
          <div className="w-full max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-[750] text-center mb-10 sm:mb-12">
              Frequently Asked Questions
            </h2>

            <div className="flex flex-col gap-4">

              <details className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 group">
                <summary className="px-6 py-5 sm:px-8 sm:py-6 text-lg sm:text-xl font-semibold cursor-pointer flex items-center justify-between gap-4 hover:bg-gray-50">
                  <span>What will I actually get?</span>
                  <span className="text-xl sm:text-2xl group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-5 sm:px-8 sm:pb-6 text-gray-600 text-base sm:text-lg">
                  AI creates a short video with your message.
                </div>
              </details>

              <details className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 group">
                <summary className="px-6 py-5 sm:px-8 sm:py-6 text-lg sm:text-xl font-semibold cursor-pointer flex items-center justify-between gap-4 hover:bg-gray-50">
                  <span>Do I need to pay before seeing the video?</span>
                  <span className="text-xl sm:text-2xl group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-5 sm:px-8 sm:pb-6 text-gray-600 text-base sm:text-lg">
                  You can preview before paying.
                </div>
              </details>

              <details className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 group">
                <summary className="px-6 py-5 sm:px-8 sm:py-6 text-lg sm:text-xl font-semibold cursor-pointer flex items-center justify-between gap-4 hover:bg-gray-50">
                  <span>Will I be able to download it?</span>
                  <span className="text-xl sm:text-2xl group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-6 pb-5 sm:px-8 sm:pb-6 text-gray-600 text-base sm:text-lg">
                  Yes, high-quality download is available.
                </div>
              </details>

            </div>
          </div>
        </section>

      </main>

      {/* ✅ FOOTER COMPONENT INSERTED HERE */}
      <Footer />
    </>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, Mail, Menu, X, Flame, Sparkles, Pointer } from "lucide-react"; 
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import Link from "next/link";

// --- HELPERS & STYLES ---

// SVG for the paintbrush effect (a yellow, wavy brush stroke)
const brushStrokeSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 30' preserveAspectRatio='none'%3E%3Cpath fill='%23E5FF00' d='M5,20 Q 75,5 150,20 Q 225,35 295,20 L 295,25 Q 225,40 150,25 Q 75,10 5,25 Z' /%3E%3C/svg%3E`;

const customStyles = `
  .scrollbar-hide::-webkit-scrollbar {
      display: none;
  }
  .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }

  .btn-primary {
    background-color: #E5FF00;
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
     background-color: #D4EE00;
     box-shadow: 0 4px 15px rgba(229, 255, 0, 0.4);
     transform: translateY(-1px);
  }
  
  .btn-primary:active {
     transform: translateY(0px);
  }

  .fix-pixelated-borders {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translateZ(0); 
    -webkit-font-smoothing: subpixel-antialiased;
    outline: 1px solid transparent; 
    will-change: transform;
  }

  /* New class for the paintbrush highlight */
  .paintbrush-highlight {
    background-image: url("${brushStrokeSVG}");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
`;

const SimpleImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <img src={src} alt={alt} className={className || "w-full h-full object-cover"} />
);

// --- NAVBAR COMPONENT ---
const CustomNavbar = () => {
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
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer no-underline group z-50 relative">
          <span className="font-[900] tracking-tight text-xl sm:text-2xl text-gray-900 leading-none">
            RoastYourFriend.com
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">How it Works</Link>
            <Link href="/characters" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">Characters</Link>
            <Link href="#contact-us" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">Support</Link>
            <Link href="/characters">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E5FF00] text-black font-bold text-sm hover:bg-[#D4EE00] hover:shadow-md hover:scale-105 transition-all cursor-pointer">
                Generate Video
              </button>
            </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button 
          className="md:hidden z-50 relative p-2" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 overflow-hidden shadow-sm md:hidden"
            >
              <div className="flex flex-col p-6 gap-6 text-center items-center">
                 <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-900">
                   How it Works
                 </Link>
                 <Link href="/characters" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-900">
                   Characters
                 </Link>
                 <Link href="#contact-us" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-900">
                   Support
                 </Link>
                 <Link href="/characters" onClick={() => setIsOpen(false)} className="w-full max-w-xs">
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E5FF00] text-black font-bold text-lg hover:bg-[#D4EE00] hover:shadow-md transition-all cursor-pointer">
                      Generate Video
                    </button>
                 </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};


// --- DATA ---

const SHOWCASE_VIDEOS = [
  {
    video: "/Videos/one.mp4",
    thumb: "/Videos/one.png" 
  },
  {
    video: "/Videos/four.mp4",
    thumb: "/Videos/four.png"
  },
  {
    video: "/Videos/five.mp4",
    thumb: "/Videos/five.png"
  }
];

const STEPS = [
  {
    id: "01",
    title: "Pick Your Character",
    description: "Browse our library of funny avatars, celebs, and cartoons. Find the perfect face to deliver your message.",
    image: "https://placehold.co/800x600/121212/ffffff?text=Step+1:+Select+Avatar",
  },
  {
    id: "02",
    title: "Type Your Message",
    description: "Write a birthday wish, a roast, or a holiday greeting. Our AI syncs the lips and voice perfectly in seconds.",
    image: "https://placehold.co/800x600/121212/ffffff?text=Step+2:+Type+Script",
  },
  {
    id: "03",
    title: "Send & Laugh",
    description: "Preview your video instantly. Download it to your phone and send it to your group chat for instant reactions.",
    image: "https://placehold.co/800x600/121212/ffffff?text=Step+3:+Get+Video",
  },
];

const TESTIMONIALS = [
  { 
    name: "Jake M.", 
    role: "Pranked his brother", 
    title: "The roast was absolutely brutal 💀", 
    text: "I sent a video of a 'news anchor' announcing my brother's 30th birthday as a national tragedy. The whole family was crying laughing. Best $5 I ever spent.",
    avatar: "/Videos/jake.png" 
  },
  { 
    name: "Sarah Jenkins", 
    role: "Saved by AI Greetings", 
    title: "Forgot a birthday... saved the day!", 
    text: "I completely forgot my best friend's birthday. I made a personalized video in the Uber on the way to her party. She loved it more than the actual gift I bought!",
    avatar: "/Videos/sarah.png" 
  },
  { 
    name: "Mike T.", 
    role: "Dad of 3", 
    title: "Actually got my kids to clean up", 
    text: "Used the Santa character to send a 'naughty list' warning to my kids about their messy rooms. Their rooms were spotless in 10 minutes. This app is magic.",
    avatar: "/Videos/mike.png" 
  },
];

const FAQS = [
  { q: "How fast will I get my video?", a: "Almost instantly! It usually takes about 30-60 seconds to generate your video once you click create." },
  { q: "Can I use this for pranks?", a: "Absolutely! Just keep it friendly. We have filters for hate speech, but roasting your friends is highly encouraged." },
  { q: "Do I need to pay before seeing it?", a: "No way. You can generate a preview to see if the lip-sync looks good before you decide to download the high-quality version." },
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <details className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 group">
      <summary className="px-6 py-5 sm:px-8 sm:py-6 text-lg font-bold cursor-pointer flex items-center justify-between gap-4 hover:bg-gray-50 list-none transition-colors">
        <span>{question}</span>
        <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90 text-gray-400" />
      </summary>
      <div className="px-6 pb-5 sm:px-8 sm:pb-6 text-gray-600 text-base leading-relaxed">
        {answer}
      </div>
    </details>
  );
};

// --- UPDATED COMPONENT: Controlled Interactive Video Card ---
interface CardProps {
  image: string;
  video: string;
  className?: string;
  isActive: boolean;
  onToggle: () => void;
}

const InteractiveVideoCard = ({ image, video, className, isActive, onToggle }: CardProps) => {
  return (
    <div 
      className={`relative overflow-hidden cursor-pointer group bg-gray-100 fix-pixelated-borders ${className}`} 
      onClick={onToggle}
    >
      {!isActive ? (
        <SimpleImage src={image} alt="Video Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <video
          src={video}
          controls={false} 
          autoPlay
          playsInline
          // NO LOOP property here
          onEnded={onToggle} // This will reset the state when video finishes
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};


export default function App() {
  const router = useRouter(); 
  
  // State to track which video is playing (by index). null means none.
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  // State for scroll indicators (Video dots REMOVED)
  
  // State for testimonial scroll indicators
  const testimonialsScrollRef = useRef<HTMLDivElement>(null);
  const [testimonialScrollIndex, setTestimonialScrollIndex] = useState(0);

  const handleVideoToggle = (index: number) => {
    if (activeVideoIndex === index) {
      setActiveVideoIndex(null);
    } else {
      setActiveVideoIndex(index);
    }
  };

  // Scroll handler to update testimonial dots
  const handleTestimonialScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    const index = Math.round(scrollLeft / clientWidth);
    setTestimonialScrollIndex(index);
  };

  return (
    <>
      <style>{customStyles}</style>
      
      {/* Navbar */}
      <CustomNavbar />

      <main className="flex flex-col items-center bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-[#E5FF00] selection:text-black">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center px-4 pt-24 sm:pt-32 pb-12 sm:pb-16 max-w-7xl w-full">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-[900] leading-[1.04] tracking-tight text-gray-900"
          >
            Send the{" "}
            <span className="text-6xl sm:text-7xl lg:text-8xl text-gray-900">funniest</span> AI greetings in{" "}
            <span className="relative inline-block">
              <span className="relative z-10">seconds</span>
              {/* Highlight under the word 'seconds' */}
              <span className="absolute -bottom-4 left-0 w-full h-12 paintbrush-highlight z-0 opacity-70"></span>
            </span>
            {" "}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 text-xl sm:text-2xl text-gray-600 max-w-2xl font-medium leading-relaxed"
          >
            Create hilarious personalized videos for birthdays and roasts. No editing skills needed.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={() => router.push("/characters")}
            className="mt-10 px-10 py-5 rounded-2xl btn-primary text-gray-800 font-extrabold text-lg shadow-md flex items-center gap-3 cursor-pointer"
          >
            Start Creating 
          </motion.button>
        </section>

        {/* VIDEO SHOWCASE GRID - Dots Removed */}
        <section className="w-full max-w-7xl px-4 pb-2">
          <div 
            className="flex overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-4 pb-8 sm:grid sm:grid-cols-3 sm:gap-8 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
          >
            {SHOWCASE_VIDEOS.map((item, index) => {
              const rotation = index === 0 ? "sm:-rotate-2" : index === 1 ? "sm:rotate-2" : "sm:-rotate-1";
              
              return (
                <div key={index} className="min-w-[85vw] sm:min-w-0 snap-center">
                  <InteractiveVideoCard 
                    image={item.thumb}
                    video={item.video}
                    isActive={activeVideoIndex === index}
                    onToggle={() => handleVideoToggle(index)}
                    className={`rounded-[2rem] border-[6px] border-[#E5FF00] shadow-md ${rotation} hover:rotate-0 transition-transform duration-500 aspect-[9/16]`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Text Block with Pointer Icon */}
        {/* UPDATED: Changed mt-0 to mt-20 to add more space above this section */}
        <div className="w-full flex flex-col items-center justify-center gap-2 mb-32 mt-20">
          <Pointer className="w-6 h-6 text-gray-900 mb-2" />
          <h3 className="text-center font-[900] text-gray-900 tracking-tight leading-tight">
            <span className="text-lg sm:text-xl align-middle">Tap </span>
            <span className="text-2xl sm:text-3xl align-middle">CHARACTERS</span>
            <span className="text-lg sm:text-xl align-middle"> to test</span>
          </h3>
        </div>

        <hr className="w-full max-w-7xl border-gray-100 my-0" />

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="w-full bg-white py-32 sm:py-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="text-center mb-12 sm:mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl font-[800] tracking-tight text-gray-900 mb-6"
              >
                Go from idea to video in <span className="text-black underline decoration-[#E5FF00] decoration-4 underline-offset-4">3 steps</span>
              </motion.h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                No complex software. No waiting. Just type and generate.
              </p>
            </div>

            <div className="flex flex-col space-y-24 sm:space-y-32">
              {STEPS.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={`
                        flex flex-col gap-12 sm:gap-20 sm:items-center
                        ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}
                    `}
                  >
                    <div className="flex-1 w-full text-center lg:text-left order-2 lg:order-none">
                      <div className="inline-block text-sm font-bold bg-black text-[#E5FF00] px-3 py-1 rounded-full mb-4 shadow-sm">
                        STEP {step.id}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-[750] text-gray-900 mb-4 sm:mb-6 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                        {step.description}
                      </p>
                    </div>

                    <div className="flex-1 w-full order-1 lg:order-none">
                      <div className="relative rounded-3xl overflow-hidden border-2 border-gray-100 shadow-lg bg-gray-50 aspect-[4/3] group">
                        <SimpleImage 
                          src={step.image} 
                          alt={step.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        <hr className="w-full max-w-7xl border-gray-100 my-0" />

        {/* TESTIMONIALS SECTION */}
        <section className="bg-white w-full py-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 shadow-sm mb-8">
            <span className="text-yellow-500 text-lg">🤩</span>
            <span className="text-sm font-semibold text-gray-700">Join 10,000+ happy pranksters</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-center mb-16 max-w-4xl px-4 tracking-tight">
            People are loving it
          </h2>

          <div className="w-full max-w-7xl px-0 sm:px-6">
            <div 
              ref={testimonialsScrollRef}
              onScroll={handleTestimonialScroll}
              className="flex overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-6 px-4 pb-12 sm:grid sm:grid-cols-3 sm:gap-6 sm:px-0 sm:pb-0 scrollbar-hide"
            >
              {TESTIMONIALS.map((item, i) => (
                <div 
                  key={i} 
                  className="min-w-[85vw] sm:min-w-0 snap-center bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-auto"
                >
                  <div className="flex text-yellow-400 mb-4 gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-base flex-grow">"{item.text}"</p>
                  
                  <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-center gap-3">
                      {/* Avatar Image */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <SimpleImage 
                          src={item.avatar} 
                          alt={item.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                          <p className="font-bold text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{item.role}</p>
                      </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial Indicators (Dots) */}
            <div className="flex justify-center gap-2 mt-6 sm:hidden">
              {TESTIMONIALS.map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-full transition-colors duration-300 w-2.5 h-2.5 ${
                    i === testimonialScrollIndex ? "bg-gray-900" : "bg-gray-300"
                  }`} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 px-6 w-full max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact-us" className="w-full px-4 pt-10 pb-20 flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-lg font-bold text-gray-400 uppercase tracking-wider">Need Help?</h2>
              <a
                href="mailto:support@aigreetings.com"
                className="mt-4 px-6 py-3 rounded-xl bg-[#E5FF00] text-black font-semibold text-lg shadow-sm hover:bg-[#D4EE00] hover:shadow-md transition-all flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                support@aigreetings.com
              </a>
            </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
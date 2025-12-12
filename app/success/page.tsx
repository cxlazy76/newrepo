"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Download, Facebook, Mail, X, Menu } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- START: Utility Functions ---
const getDomain = () => {
  return typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
};

// Placeholder for human-readable filename logic.
const getCharacterName = (videoId: string) => {
    // In a real app, this would be fetched or derived from the video ID
    if (videoId.length > 5) return "Santa Claus"; 
    return "AI Greeting Video";
};
const VIDEO_FILENAME = (name: string) => `${name.toLowerCase().replace(/\s/g, '-')}.mp4`;

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Share link copied to clipboard!");
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
// --- END: Utility Functions ---


// --- START: Custom Components (Adopted from Inspiration Code) ---

// Replicating Navbar from inspiration
const CustomNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-16 sm:h-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 cursor-pointer no-underline group z-50 relative">
                    <span className="font-[900] tracking-tight text-xl sm:text-2xl text-gray-900 leading-none">
                        RoastYourFriend.com
                    </span>
                </Link>
                {/* Simplified desktop links for success page context */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/characters">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E5FF00] text-black font-bold text-sm hover:bg-[#D4EE00] hover:shadow-md hover:scale-105 transition-all cursor-pointer">
                            Make Another Video
                        </button>
                    </Link>
                </div>
                <button className="md:hidden z-50 relative p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
            {/* Mobile Menu omitted for brevity, assume it links back to home/characters */}
        </nav>
    );
};

// Replicating Footer from inspiration
const Footer = () => (
    <footer className="w-full bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500 font-medium">
        © {new Date().getFullYear()} RoastYourFriend.com. All rights reserved.
    </footer>
);

// Styles from inspiration for button and scrollbar
const customStyles = `
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
`;

// --- END: Custom Components ---


function SuccessContent() {
    // --- State and Polling Logic (Unchanged from previous successful implementation) ---
    useEffect(() => {
        window.history.scrollRestoration = "manual";
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        };
    }, []);

    const params = useSearchParams();
    const session_id = params.get("session_id");

    const [videoId, setVideoId] = useState("");
    const [status, setStatus] = useState<"error" | "processing" | "ready">("processing");
    const [characterName, setCharacterName] = useState("AI Character");


    useEffect(() => {
        if (!session_id) {
            setStatus("error");
            return;
        }

        let active = true;
        let attempts = 0;
        const delays = [1000, 1500, 2000, 3000, 5000, 8000, 13000, 20000];

        const poll = async () => {
            attempts++;
            if (attempts > 30) {
                setStatus("error");
                return;
            }

            const res = await fetch(`/api/video/status?session_id=${session_id}`);
            if (!res.ok) {
                setStatus("error");
                return;
            }

            const data = await res.json();
            if (!active) return;

            if (data.status === "error") {
                setStatus("error");
                return;
            }

            if (data.status === "finished") {
                setVideoId(data.id);
                setCharacterName(getCharacterName(data.id));
                setStatus("ready");
                return;
            }

            const delay = delays[Math.min(attempts - 1, delays.length - 1)];
            setTimeout(poll, delay);
        };

        poll();

        return () => {
            active = false;
        };
    }, [session_id]);

    // --- Analytics/Cleanup Logic (kept as a note, implement your originals here) ---
    useEffect(() => {
        if (status === "ready") {
            // Your original analytics, log, and localStorage cleanup here...
        }
    }, [status, session_id]);


    // --- Content Rendering ---

    if (status === "error") return (
        <main className="min-h-screen pt-20 flex justify-center items-center">
            <h1 className="text-2xl font-bold text-red-600">Video Generation Error</h1>
        </main>
    );

    if (status === "processing") return (
        <main className="min-h-screen pt-20 flex flex-col items-center justify-center text-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900">Your Roast is Cooking...</h1>
            <p className="mt-2 text-gray-600">This usually takes under 60 seconds.</p>
        </main>
    );

    if (status === "ready" && videoId) {
        const filename = VIDEO_FILENAME(characterName);
        const publicStreamUrl = `/stream?id=${videoId}`;
        const downloadUrl = `/stream?id=${videoId}&filename=${encodeURIComponent(filename)}`;
        const fullShareUrl = `${getDomain()}/stream?id=${videoId}`;
        const shareText = `Check out this hilarious AI video I made with ${characterName}!`;

        return (
            <main className="flex flex-col items-center bg-white text-gray-900 font-sans min-h-screen pt-28 md:pt-32 pb-16">
                
                {/* Main Content Area: Centered and constrained */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-lg mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
                >
                    
                    {/* Character Name Header */}
                    <h1 className="text-3xl sm:text-4xl font-[900] tracking-tight text-gray-900 mb-2">
                        {characterName} :
                    </h1>
                    
                    {/* Status Message */}
                    <p className="text-xl sm:text-2xl text-gray-600 font-medium mb-10">
                        Your video is ready to share!
                    </p>

                    {/* Video Player Card */}
                    <div className="aspect-[9/16] w-full max-w-xs shadow-2xl rounded-[1.5rem] overflow-hidden bg-black border-[6px] border-gray-100 mb-8">
                        <video 
                            data-testid="video" 
                            src={publicStreamUrl} 
                            controls 
                            className="w-full h-full object-cover"
                            // Adding the play icon centered like in the image
                            poster="/placeholder-play-icon.png" // Use a placeholder image with a play icon if needed
                        ></video>
                    </div>

                    {/* Download Button (Styled as btn-primary) */}
                    <a
                        href={downloadUrl}
                        className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-4 mb-8 text-black text-lg font-extrabold rounded-xl shadow-lg btn-primary hover:scale-[1.02] transition-all"
                        aria-label={`Download ${characterName} Video`}
                    >
                        <Download size={20} />
                        Download Video
                    </a>

                    {/* Share Section Header */}
                    <p className="text-base font-semibold text-gray-600 mb-4">
                        Forward directly to your friend on :
                    </p>
                    
                    {/* Social Share Icons */}
                    <div className="flex items-center space-x-4 mb-12">
                        
                        {/* Facebook */}
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`}
                            target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"
                            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md">
                            <Facebook size={24} />
                        </a>
                        
                        {/* Email */}
                        <a href={`mailto:?subject=${encodeURIComponent('Your AI Video Greeting')}&body=${encodeURIComponent(shareText + '\n\nLink: ' + fullShareUrl)}`}
                            aria-label="Share via Email"
                            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md">
                            <Mail size={24} />
                        </a>

                        {/* Copy Link (Optional, for completeness) */}
                         <button
                            onClick={() => copyToClipboard(fullShareUrl)}
                            className="p-3 bg-gray-100 text-gray-700 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors shadow-md"
                            aria-label="Copy Share Link"
                        >
                            <Copy size={24} />
                        </button>
                    </div>

                    {/* Notice Section */}
                    <div className="mt-8 pt-8 border-t border-gray-100 w-full max-w-md text-sm text-gray-500 leading-relaxed">
                        <p className="font-bold text-gray-600 mb-2">Notice:</p>
                        <p>
                            If you are not satisfied with the result, please contact us via 
                            <a href="mailto:contact@roastyourfriend.com" className="text-blue-600 hover:underline ml-1">contact@roastyourfriend.com</a>.
                        </p>
                        <p className="mt-2">
                            You may be eligible for a refund or a new video based on your own choice.
                        </p>
                    </div>

                </motion.div>
            </main>
        );
    }
}

export default function SuccessPage() {
    return (
        <>
            <style jsx global>{customStyles}</style>
            <CustomNavbar />
            <Suspense fallback={
                <main className="min-h-screen pt-20 flex flex-col items-center justify-center text-gray-700">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent mb-4"></div>
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </main>
            }>
                <SuccessContent />
            </Suspense>
            <Footer />
        </>
    );
}
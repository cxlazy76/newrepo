"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Download, Share2, Menu, X, Check } from "lucide-react"; 
import { motion } from "framer-motion";
import Link from "next/link";

// --- START: Utility Functions and Styles ---

const getDomain = () => {
  return typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
};

const getCharacterName = (videoId: string) => {
    // Placeholder function: Use your actual mapping logic here if needed
    if (videoId === "example-video-id") return "The AI News Anchor"; 
    // Default fallback if real name cannot be fetched
    return "AI Greeting Video";
};

const VIDEO_FILENAME = (name: string) => `${name.toLowerCase().replace(/\s/g, '-')}.mp4`;

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
// --- END: Utility Functions and Styles ---


// --- START: Component Placeholders ---

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

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/characters">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E5FF00] text-black font-bold text-sm hover:bg-[#D4EE00] hover:shadow-md hover:scale-105 transition-all cursor-pointer">
                            Make Another Video
                        </button>
                    </Link>
                </div>

                <button 
                    className="md:hidden z-50 relative p-2" 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </nav>
    );
};

const CustomFooter = () => (
    <footer className="w-full bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500 font-medium">
        <div className="max-w-7xl mx-auto px-4">
            © {new Date().getFullYear()} RoastYourFriend.com. All rights reserved.
        </div>
    </footer>
);

// --- END: Component Placeholders ---


function SuccessContent() {
    
    // Ensure scroll is reset on page load (important for mobile UX)
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
    const [linkCopied, setLinkCopied] = useState(false); 


    // --- RESTORED API POLLING LOGIC ---
    useEffect(() => {
        if (!session_id) {
            setStatus("error");
            return;
        }

        let active = true;
        let attempts = 0;
        // Exponential backoff delays
        const delays = [1000, 1500, 2000, 3000, 5000, 8000, 13000, 20000];
        
        const poll = async () => {
            attempts++;
            if (attempts > 30) { // Safety limit for maximum attempts
                setStatus("error");
                console.error("Polling stopped: Maximum attempts reached.");
                return;
            }

            const res = await fetch(`/api/video/status?session_id=${session_id}`);
            
            if (!res.ok) {
                setStatus("error");
                console.error("Polling failed: Network error or bad response.");
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

            // Continue polling
            const delay = delays[Math.min(attempts - 1, delays.length - 1)];
            setTimeout(poll, delay);
        };

        poll();

        return () => {
            active = false;
        };
    }, [session_id]);
    // --- END RESTORED LOGIC ---


    // Function to handle link copy and confirmation
    const handleCopy = async (text: string) => {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 3000); 
        } else {
             console.error("Clipboard API not available. Please copy manually.");
        }
    };

    // Function to handle native sharing
    const handleNativeShare = (url: string) => {
        if (navigator.share) {
            navigator.share({
                title: 'Your AI Greeting Video',
                text: `Check out this hilarious AI video I made with ${characterName}!`,
                url: url,
            }).catch((error) => {
                console.error('Error or cancellation during native share:', error);
            });
        } else {
            handleCopy(url);
        }
    };


    // --- RENDERING ---

    if (status === "error") return (
        <main className="min-h-screen pt-20 flex justify-center items-center">
            <h1 className="text-2xl font-bold text-red-600">Video Generation Error</h1>
            <p className="mt-4 text-gray-600">Please contact support with your session ID: {session_id}</p>
        </main>
    );

    if (status === "processing") return (
        <main className="min-h-screen pt-20 flex flex-col items-center justify-center text-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900">Your Roast is Cooking...</h1>
            <p className="mt-2 text-gray-600">This usually takes under 60 seconds. Hang tight!</p>
        </main>
    );

    if (status === "ready" && videoId) {
        const filename = VIDEO_FILENAME(characterName);
        const publicStreamUrl = `/stream?id=${videoId}`;
        const downloadUrl = `/stream?id=${videoId}&filename=${encodeURIComponent(filename)}`;
        const fullShareUrl = `${getDomain()}/stream?id=${videoId}`;

        return (
            <main className="flex flex-col items-center bg-white text-gray-900 font-sans min-h-screen pt-28 md:pt-32 pb-16">
                
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-lg mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
                >
                    
                    {/* Main Title */}
                    <h1 className="text-4xl sm:text-5xl font-[900] tracking-tight text-gray-900 mb-2">
                        Your video is ready to share!
                    </h1>
                    
                    {/* Character Subtitle */}
                    <p className="text-xl sm:text-2xl text-gray-600 font-medium mb-10">
                        ({characterName} Greeting)
                    </p>

                    {/* VIDEO PLAYER CARD (9:16 Aspect Ratio) */}
                    <div className="aspect-[9/16] w-full max-w-[280px] shadow-2xl rounded-2xl overflow-hidden bg-black border-4 border-gray-200 mb-8 sm:max-w-xs">
                        <video 
                            data-testid="video" 
                            src={publicStreamUrl} 
                            controls 
                            className="w-full h-full object-cover"
                            poster="/placeholder-play-icon.png"
                        ></video>
                    </div>

                    {/* --- ACTION BUTTONS --- */}
                    <div className="w-full max-w-xs space-y-4">
                        
                        {/* 1. Download Button (btn-primary) */}
                        <a
                            href={downloadUrl}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 text-black text-lg font-extrabold rounded-xl shadow-md btn-primary hover:scale-[1.02] transition-all"
                            aria-label="Download Video"
                        >
                            <Download size={20} />
                            Download Video
                        </a>

                        {/* 2. Share Video Button (System Share) */}
                        <button
                            onClick={() => handleNativeShare(fullShareUrl)}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 text-black text-lg font-extrabold rounded-xl shadow-md bg-gray-100 hover:bg-gray-200 hover:scale-[1.02] transition-all"
                            aria-label="Share Video"
                        >
                            <Share2 size={20} />
                            Share Video
                        </button>
                        
                        {/* 3. Copy Link Button with Confirmation */}
                        <button
                            onClick={() => handleCopy(fullShareUrl)}
                            className={`w-full flex items-center justify-center gap-3 px-6 py-3 text-lg font-extrabold rounded-xl shadow-md transition-all ${
                                linkCopied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            aria-label="Copy Link"
                        >
                            {linkCopied ? <Check size={20} /> : <Copy size={20} />}
                            {linkCopied ? 'Link Copied to Clipboard!' : 'Copy Share Link'}
                        </button>
                    </div>
                    
                    {/* Notice Section */}
                    <div className="mt-12 pt-8 border-t border-gray-100 w-full max-w-md text-sm text-gray-500 leading-relaxed">
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
            <CustomFooter />
        </>
    );
}
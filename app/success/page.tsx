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
    // Placeholder function: Replace with actual logic to fetch character name
    if (videoId.length > 5) return "Santa Claus"; 
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


// --- START: Component Placeholders (Matching Design Aesthetic) ---

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
            {/* Mobile menu implementation omitted for brevity */}
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
    // --- State and Polling Logic (from previous versions) ---
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
    const [linkCopied, setLinkCopied] = useState(false); // New state for copy confirmation

    // Polling logic omitted for brevity (keep your full implementation here)
    useEffect(() => {
        // Placeholder for polling logic
        if (session_id) {
            // Simulate success after a short delay
            setTimeout(() => {
                setVideoId("example-video-id");
                setCharacterName(getCharacterName("example-video-id"));
                setStatus("ready");
            }, 3000);
        } else {
            setStatus("error");
        }
    }, [session_id]);


    // Function to handle link copy and confirmation
    const handleCopy = async (text: string) => {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 3000); 
        } else {
             // Fallback for older browsers
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
                // If user cancels or share fails, log or provide feedback
                console.error('Error or cancellation during native share:', error);
                // Optionally provide a fallback UI
            });
        } else {
            // Fallback: Copy link if native share is not available
            handleCopy(url);
        }
    };


    // --- RENDERING ---

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
        const shareText = `Check out this hilarious AI video I made!`;

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

                    {/* Video Player Card */}
                    <div className="aspect-[16/9] w-full max-w-md shadow-2xl rounded-2xl overflow-hidden bg-black border-4 border-gray-200 mb-8">
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
                    
                    {/* Direct Social Links (WhatsApp and Telegram) */}
                    <div className="flex items-center space-x-6 mt-8">
                        <span className="text-gray-600 font-medium">Or send directly via:</span>
                        
                        {/* WhatsApp */}
                        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + fullShareUrl)}`}
                            target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"
                            className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md">
                            {/* WhatsApp SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.0003 2C6.48679 2 2.01258 6.47169 2.00032 11.9793C2.00032 13.7915 2.50284 15.4984 3.39867 16.9429L2.00032 21.9997L7.14959 20.627C8.55835 21.464 10.2185 21.9056 12.0003 21.9066H12.0143C17.5143 21.8988 22.0003 17.4258 22.0003 11.9793C22.0003 6.47169 17.5143 2 12.0003 2Z"/>
                            </svg>
                        </a>
                        
                        {/* Telegram */}
                        <a href={`https://t.me/share/url?url=${encodeURIComponent(fullShareUrl)}&text=${encodeURIComponent(shareText)}`}
                            target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram"
                            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md">
                            {/* Telegram SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.397 5.513c-.452-.27-.99-.34-1.554-.207L3.435 11.192c-.856.417-.866 1.442-.016 1.868l3.435 1.708 7.323-4.595c.34-.216.63.02.34.34L7.56 16.602l-.578 3.553c.49.19.98.28 1.47.28l.84-2.67 4.1-2.073 3.65 2.308c.67.425 1.55-.07 1.47-.82l.67-6.023c.09-.64-.26-1.29-.86-1.58z"/>
                            </svg>
                        </a>
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
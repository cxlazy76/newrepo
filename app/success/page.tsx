"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Download, Facebook, Mail, Share2, Twitter, Whatsapp } from "lucide-react";

// --- START: Component Imports (Assumed to exist based on inspiration) ---
// NOTE: I am providing the core logic in this file and using standard HTML/Tailwind for styling
// based on the visual inspiration and the provided code's aesthetic (e.g., bg-white, gray-900 text).
// If you have actual Navbar, Footer, etc., import them here.
const Navbar = ({ step }: { step: number }) => (
    <div className="w-full py-4 px-6 bg-white shadow-sm flex justify-center text-center">
        <h1 className="text-xl font-bold text-gray-800">Video Generator</h1>
    </div>
);
const Footer = () => (
    <footer className="w-full bg-gray-50 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
    </footer>
);
const StepIndicator = ({ step }: { step: number }) => (
    <div className="flex justify-center space-x-2 my-6">
        {[1, 2, 3].map(s => (
            <span key={s} className={`h-2 w-10 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
        ))}
    </div>
);
// --- END: Component Imports ---


// --- START: Utility Functions (from previous answer, slightly refined) ---
const getDomain = () => {
  return typeof window !== 'undefined' ? window.location.origin : 'https://example.com'; 
};

// Placeholder for human-readable filename logic. In a real app, you'd fetch this.
// I'm using a placeholder function to simulate getting the character name from the video ID/session.
const getCharacterName = (videoId: string) => {
    // This is a dummy implementation. In reality, you'd fetch the character name 
    // from your database using videoId/session_id or pass it as a param.
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


function SuccessContent() {
    // --- State and Setup ---
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


    // --- Polling Logic ---
    useEffect(() => {
        // ... (Log view omitted for brevity, keep it if you need it)

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
                // FIX: Derive character name here using data.id or fetch from an endpoint
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

    // --- Analytics/Cleanup Logic (omitted for brevity, keep your original) ---
    useEffect(() => {
        if (status === "ready") {
            // ... Your original analytics/log/localStorage cleanup code here ...
        }
    }, [status, session_id]);


    // --- Content Rendering ---

    if (status === "error") return <main className="min-h-screen pt-20 flex justify-center items-center">
        <h1 className="text-2xl font-bold text-red-600">Video Generation Error</h1>
    </main>;
    
    // Processing UI based on inspiration style
    if (status === "processing") return (
        <main className="min-h-screen pt-20 flex flex-col items-center justify-center text-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <h1 className="text-2xl font-bold">Generating Your Video...</h1>
            <p className="mt-2">This usually takes under 60 seconds. Please wait.</p>
        </main>
    );

    // Ready UI: Styled like the character detail page
    if (status === "ready" && videoId) {
        
        const filename = VIDEO_FILENAME(characterName);
        const publicStreamUrl = `/stream?id=${videoId}`;
        const downloadUrl = `/stream?id=${videoId}&filename=${encodeURIComponent(filename)}`;
        const fullShareUrl = `${getDomain()}/stream?id=${videoId}`;
        const shareText = `Check out my new AI video from ${characterName}!`;

        return (
            <main className="flex flex-col items-center bg-white text-gray-900 font-sans min-h-screen pt-20 md:pt-24">
                
                <div className="w-full flex justify-center">
                    <StepIndicator step={3} />
                </div>

                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-10 md:pb-24 lg:mt-8">

                    <div className="flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-20">

                        {/* --- LEFT COLUMN: Video Preview --- */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
                            
                            <h2 className="text-3xl font-extrabold mb-4 text-center lg:text-left">{characterName} :</h2>
                            
                            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-full flex justify-center lg:justify-start">
                                {/* Video Player */}
                                <div className="aspect-[9/16] w-full max-w-sm shadow-2xl rounded-xl overflow-hidden bg-black">
                                    <video 
                                        data-testid="video" 
                                        src={publicStreamUrl} 
                                        controls 
                                        className="w-full h-full object-cover"
                                        poster="/placeholder-poster.jpg" // Add your poster image
                                        autoPlay 
                                    ></video>
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: Actions & Notice --- */}
                        <div className="w-full lg:w-1/2 mx-auto lg:mx-0 pt-10 lg:pt-0">
                            
                            <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Video is Ready!</h3>

                            {/* Download Button */}
                            <a
                                href={downloadUrl}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 mb-6 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                                aria-label={`Download ${characterName} Video`}
                            >
                                <Download size={20} />
                                Download Video ({filename})
                            </a>

                            {/* Share Actions */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-gray-600 font-medium mb-3">Forward directly to your friend on:</p>
                                
                                <div className="flex items-center space-x-4">
                                    {/* Share Link Button */}
                                    <button
                                        onClick={() => copyToClipboard(fullShareUrl)}
                                        className="flex-shrink-0 p-3 bg-white text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors shadow-md"
                                        aria-label="Copy Share Link"
                                    >
                                        <Copy size={20} />
                                    </button>

                                    {/* Social Share Icons */}
                                    <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + fullShareUrl)}`}
                                        target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"
                                        className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md">
                                        <Whatsapp size={20} />
                                    </a>
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`}
                                        target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"
                                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md">
                                        <Facebook size={20} />
                                    </a>
                                    <a href={`mailto:?subject=${encodeURIComponent('Your AI Video Greeting')}&body=${encodeURIComponent(shareText + '\n\nLink: ' + fullShareUrl)}`}
                                        aria-label="Share via Email"
                                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md">
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>
                            
                            {/* Notice/Refund Policy Section */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <h4 className="text-lg font-bold text-gray-800 mb-2">Notice:</h4>
                                <p className="text-gray-600 text-sm">
                                    If you are not satisfied with the result, please contact us via 
                                    <a href="mailto:contact@roastyourfriend.com" className="text-blue-600 hover:underline ml-1">contact@roastyourfriend.com</a>
                                    .
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                    You may be eligible for a refund or a new video based on your own choice.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for Related Characters or other content if needed */}
                    {/* <RelatedCharacters ... /> */}

                </div>
            </main>
        );
    }
}

export default function SuccessPage() {
    return (
        <>
            <Navbar step={3} /> 
            <Suspense fallback={
                <main className="min-h-screen pt-20 flex flex-col items-center justify-center text-gray-700">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </main>
            }>
                <SuccessContent />
            </Suspense>
            <Footer />
        </>
    );
}
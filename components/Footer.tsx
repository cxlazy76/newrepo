import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Mail, Youtube } from 'lucide-react'; 

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Column 1: Brand & Logo */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 cursor-pointer no-underline">
               <span className="font-[900] tracking-tight text-xl text-gray-900">
                 RoastYourFriend.com
               </span>
            </Link>
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
              Create hilarious personalized AI videos for birthdays, roasts, and holidays in seconds.
            </p>
          </div>

          {/* Column 2-4: Links */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-8">
             
             {/* Product Links */}
             <div className="flex flex-col gap-4">
                <h4 className="font-[900] text-gray-900 text-sm tracking-tight uppercase">Product</h4>
                <Link href="/characters" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit">Characters</Link>
                <Link href="/#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit">How it Works</Link>
                <Link href="/characters" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit">Generate Video</Link>
             </div>

             {/* Support Links */}
             <div className="flex flex-col gap-4">
                <h4 className="font-[900] text-gray-900 text-sm tracking-tight uppercase">Support</h4>
                
                {/* UPDATED: Points to the dedicated Contact page */}
                <Link href="/support/contact" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit">Contact Us</Link>
                
                {/* UPDATED: Points to the dedicated FAQ page */}
                <Link href="/support/faq" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit">FAQ</Link>
             </div>

             {/* Legal Links */}
             <div className="flex flex-col gap-4">
                <h4 className="font-[900] text-gray-900 text-sm tracking-tight uppercase">Legal</h4>
                <Link href="/legal/terms-of-service" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit">Terms of Service</Link>
                <Link href="/legal/privacy" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit">Privacy Policy</Link>
                <Link href="/legal/refund-policy" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit">Refund Policy</Link>
             </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
          <p className="text-xs font-semibold text-gray-400">
            © {new Date().getFullYear()} RoastYourFriend. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-black transition-colors transform hover:scale-110 duration-200">
                <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors transform hover:scale-110 duration-200">
                <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors transform hover:scale-110 duration-200">
                <Youtube size={22} />
            </a>
            <a href="mailto:support@aigreetings.com" className="text-gray-400 hover:text-black transition-colors transform hover:scale-110 duration-200">
                <Mail size={20} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
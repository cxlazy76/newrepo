"use client";

import React from "react";
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";

const TikTokIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 455 512.098"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path
      fillRule="nonzero"
      d="M321.331.011h-81.882v347.887c0 45.59-32.751 74.918-72.582 74.918-39.832 0-75.238-29.327-75.238-74.918 0-52.673 41.165-80.485 96.044-74.727v-88.153c-7.966-1.333-15.932-1.77-22.576-1.77C75.249 183.248 0 255.393 0 344.794c0 94.722 74.353 167.304 165.534 167.304 80.112 0 165.097-58.868 165.097-169.96V161.109c35.406 35.406 78.341 46.476 124.369 46.476V126.14C398.35 122.151 335.494 84.975 321.331 0v.011z"
    />
  </svg>
);

const Logo = () => (
  <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
    <span className="text-[#E5FF00] font-bold">Roast</span>YourFriend
  </h3>
);

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 border-t border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-14">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-10">

          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-gray-500 max-w-xs leading-relaxed">
              Personalized AI videos in seconds.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Product
            </h4>
            <ul className="mt-3 space-y-3">
              <li><a href="/characters" className="text-sm text-gray-600 hover:text-gray-900">Generate Video</a></li>
              <li><a href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Company
            </h4>
            <ul className="mt-3 space-y-3">
              <li><a href="/about" className="text-sm text-gray-600 hover:text-gray-900">About Us</a></li>
              <li><a href="/blog" className="text-sm text-gray-600 hover:text-gray-900">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Support
            </h4>
            <ul className="mt-3 space-y-3">
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</a></li>
              <li><a href="/faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800">
              Legal
            </h4>
            <ul className="mt-3 space-y-3">
              <li><a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a></li>
              <li><a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="/refund-policy" className="text-sm text-gray-600 hover:text-gray-900">Refund Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} RoastYourFriend. All rights reserved.
          </p>

          <div className="flex space-x-5 mt-5 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="inline-block"><TikTokIcon /></span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-gray-600"><Youtube className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-gray-600"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-gray-600"><Twitter className="h-5 w-5" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React from "react";
// UPDATED: Fixed import paths to go up 3 levels
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { Mail, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      {/* Added top padding to clear fixed header */}
      <main className="flex flex-col items-center bg-white text-gray-900 font-sans min-h-screen pt-32 sm:pt-40 pb-20">
        <div className="w-full max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-[900] tracking-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Have a question, a feature request, or an issue with your video? 
              We're here to help!
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            
            {/* Email Card */}
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-10 shadow-sm flex flex-col items-center text-center hover:border-gray-200 transition-colors">
              <div className="w-16 h-16 bg-[#E5FF00] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Mail className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Email Support</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                For order issues, refunds, or general inquiries. We usually reply within 24 hours.
              </p>
              <a 
                href="mailto:support@aigreetings.com"
                className="text-lg font-bold text-black border-b-2 border-[#E5FF00] hover:bg-[#E5FF00] hover:border-transparent px-2 transition-all"
              >
                support@aigreetings.com
              </a>
            </div>

            {/* Info Card */}
            <div className="bg-gray-50 border-2 border-transparent rounded-3xl p-10 flex flex-col justify-center gap-8">
               
               <div className="flex items-start gap-4">
                 <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Clock className="w-6 h-6 text-gray-900" />
                 </div>
                 <div>
                   <h4 className="font-bold text-lg text-gray-900">Response Time</h4>
                   <p className="text-gray-500">We aim to respond to all tickets within 24 hours, Monday through Friday.</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="bg-white p-3 rounded-xl shadow-sm">
                    <MessageSquare className="w-6 h-6 text-gray-900" />
                 </div>
                 <div>
                   <h4 className="font-bold text-lg text-gray-900">Refunds</h4>
                   <p className="text-gray-500">Not happy with the result? Just email us your Order ID and we'll sort it out.</p>
                 </div>
               </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
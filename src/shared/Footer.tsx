"use client";

import bgShape from "@/assets/home/Subtract.png";
import fLogo from "@/assets/home/logo.png";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { FiYoutube } from "react-icons/fi";
import { RiTiktokFill } from "react-icons/ri";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-white min-h-[400px] overflow-hidden">
      {/* Background Shape */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgShape.src})`,
          backgroundSize: "contain",
          backgroundPosition: "center top",
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
        {/* Newsletter Subscription Section - Made Responsive */}
        <div className="bg-primary rounded-2xl py-8 sm:py-12 md:py-16 lg:py-[112px] px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Text Section */}
            <div className="text-center lg:text-left w-full lg:w-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Subscribe Newsletter
              </h2>
            </div>

            {/* Form Section */}
            <form
              onSubmit={handleSubscribe}
              className="w-full lg:w-auto max-w-2xl"
            >
              <div className="flex flex-row bg-white rounded-full p-1 sm:p-2 gap-2 sm:gap-0 md:w-full w-fit">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 sm:px-6 py-3 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none bg-transparent text-sm sm:text-base"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-orange-600 text-white px-5 md:px-8 lg:px-10 py-3 rounded-full font-medium transition-colors whitespace-nowrap text-sm sm:text-base"
                >
                  Subscribe Now
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Links and Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8 mt-8 sm:mt-10 mb-8 sm:mb-12 px-4">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full md:w-auto">
            <Link
              href="/"
              className="text-default hover:text-orange-500 font-medium text-base sm:text-lg transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className="text-default hover:text-orange-500 font-medium text-base sm:text-lg transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-default hover:text-orange-500 font-medium text-base sm:text-lg transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="text-default hover:text-orange-500 font-medium text-base sm:text-lg transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>

        
          <div className="flex gap-3 sm:gap-4 justify-center md:justify-start w-full md:w-auto">
            <Link
              href="https://www.facebook.com/profile.php?id=61591749548591&notif_id=1784374321988678&notif_t=page_user_activity#"
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors group"
              aria-label="Facebook"
              target="_blank"
            >
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white" />
            </Link>
            <Link
              href="https://x.com/FreemanZ_62"
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors group"
              aria-label="Twitter"
              target="_blank"
            >
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white" />
            </Link>
            <Link
              href="https://www.instagram.com/freemanz_"
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors group"
              aria-label="Instagram"
              target="_blank"
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white" />
            </Link>
            <Link
              href="https://www.tiktok.com/@freemanz70"
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors group"
              aria-label="TikTok"
              target="_blank"
            >
              <RiTiktokFill className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white" />
            </Link>
            <Link
              href="https://www.youtube.com/@freemanzllc"
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors group"
              aria-label="YouTube"
              target="_blank"
            >
              <FiYoutube className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white" />
            </Link>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 px-4 border-t border-[#EBEBEB] pt-6 sm:pt-8">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src={fLogo}
              alt="Logo"
              className="w-16 sm:w-20 md:w-[75px] object-contain"
            />
          </div>

          {/* Copyright */}
          <p className="text-grey text-center md:text-right font-normal text-sm sm:text-base">
            ©2025 Freemanzfly . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

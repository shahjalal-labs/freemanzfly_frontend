"use client";

import about2 from "@/assets/about/a2a.png";
import about3 from "@/assets/about/a3a.png";
import about1 from "@/assets/about/aaa1.png";
import pattern from "@/assets/home/finalPattern.png";
import Image from "next/image";

export default function AboutUsBanner() {
  return (
    <section className="relative pt-64 pb-20 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-stone-50"
        style={{
          backgroundImage: `url(${pattern.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>

      <div className="relative z-10">
        {/* Hero Content */}
        <div className="text-center container mx-auto mb-16 px-4">
          <h1 className="text-[24px] md:text-5xl font-semibold text-default mb-4">
            <span className="text-primary">About</span> us
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-[727px] mx-auto text-pretty animate-fade-in delay-150">
            From boardrooms to building sites, FreemanZ LLC offers affordable,
            essential gear that empowers professionals to work with comfort,
            confidence, and purpose.
          </p>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex items-center flex-wrap md:flex-row gap-10">
            <Image src={about1} alt="About Image 1" className="w-full md:w-[382px] md:mx-auto h-[350px] md:object-cover" />
            <Image src={about2} alt="About Image 2" className="w-full md:w-[382px] md:mx-auto h-[350px] md:object-cover" />
            <Image src={about3} alt="About Image 3" className="w-full md:w-[382px] md:mx-auto h-[350px] md:object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import heroImage from "@/assets/home/heroBImage.png";
import star from "@/assets/Star.png";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";

export default function HeroBanner() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative bg-gray-50">
      {/* Light background for airy feel */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#C06E1A]/20 to-[#161A64]/20"></div>
      <div className="absolute">
        <Image
          className="w-20 h-20 object-contain left-1/2 "
          src={star}
          alt="star image"
        />
      </div>

      <div className="relative py-16 lg:pt-56 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6 max-w-[811px]">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 leading-tight">
                Built To Support{" "}
                <span className="block text-gray-900">
                  Nontraditional Learners
                </span>
              </h1>
              <p className="text-lg font-normal text-gray-600 leading-relaxed max-w-[811px]">
                Whether you&apos;re homeschooling or using FLVS, The Virtual
                Valedictorian offers both academic and social support designed
                specifically for your students. Personalized course enrichment,
                study groups, on-demand tutoring, webinars, and academic
                advising—all in one platform.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("courseCatalog")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-primary hover:bg-blue-700 text-white px-6 py-3 text-lg flex items-center gap-2 rounded-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                Try a Demo
              </button>
            </div>

            {/* Hero Image / Video */}
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                {isVideoPlaying ? (
                  <iframe
                    width="600"
                    height="400"
                    src="https://www.youtube.com/embed/F2kQkc9UARc?autoplay=1&rel=0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-[400px] rounded-xl object-cover"
                  />
                ) : (
                  <>
                    <Image
                      src={heroImage}
                      alt="Student learning online with laptop and earphones"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

                    {/* Play Button Overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Button
                        size="lg"
                        onClick={() => setIsVideoPlaying(true)}
                        className="rounded-full bg-orange-400 hover:bg-orange-500 w-16 h-16 p-0 shadow-md transition-colors"
                      >
                        <Play className="w-8 h-8 text-white" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

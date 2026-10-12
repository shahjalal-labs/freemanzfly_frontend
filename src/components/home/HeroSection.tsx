"use client";

import h5 from "@/assets/home/charger.png";
import pattern from "@/assets/home/finalPattern.png";
import h2 from "@/assets/home/h2.png";
import h3 from "@/assets/home/h3.png";
import h4 from "@/assets/home/h4.png";
import h1 from "@/assets/home/headphone.png";
import { useGetAllCouponsQuery } from "@/redux/api/shippingApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const productShowcase = [
    { id: 1, image: h1, position: "mb-8" },
    { id: 2, image: h2, position: "mt-8" },
    { id: 3, image: h3, position: "mb-8" },
    { id: 4, image: h4, position: "mt-8" },
    { id: 5, image: h5, position: "mb-8" },
    { id: 6, image: h3, position: "mt-8" },
  ];

  // const {data: getAllCouponsData} = useGetAllCouponsQuery({page: 1, limit: 100});

  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Pause animation on hover for better user experience
    const handleHover = () => {
      marquee.style.animationPlayState = "paused";
    };

    const handleHoverEnd = () => {
      marquee.style.animationPlayState = "running";
    };

    marquee.addEventListener("mouseenter", handleHover);
    marquee.addEventListener("mouseleave", handleHoverEnd);

    return () => {
      marquee.removeEventListener("mouseenter", handleHover);
      marquee.removeEventListener("mouseleave", handleHoverEnd);
    };
  }, []);

  const router = useRouter();

  const handleShopNow = () => {
    router.push(`/product`);
  };

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-default mb-6 text-balance animate-fade-in">
            Shop Now & Get All Your{" "}
            <span className="text-primary">Favorite Products</span>
            <br />
            at Amazing Discounts!
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto text-pretty animate-fade-in delay-150">
            Experience the best of online shopping with premium quality, fast
            delivery, and secure payments. Exclusive 20% off this weekend!
          </p>

          <button
            onClick={handleShopNow}
            className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 animate-fade-in delay-300 shadow-lg hover:shadow-orange-200"
          >
            Shop Now <span className="ml-2">↗</span>
          </button>
        </div>

        {/* Marquee Product Showcase */}
        <div className="overflow-hidden relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-stone-50 to-transparent z-20"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-stone-50 to-transparent z-20"></div>

          <div ref={marqueeRef} className="flex gap-6 animate-smooth-marquee">
            {[...productShowcase, ...productShowcase].map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className={`${product.position} rounded-2xl w-[300px] h-[320px] flex items-center justify-center group relative transition-all duration-500 cursor-pointer`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0  rounded-2xl transition-opacity duration-300 z-10"></div>
                <Image
                  src={product.image}
                  alt={`Product ${product.id}`}
                  className="w-full h-full object-contain drop-shadow-sm  transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind Custom Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes smoothMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-shimmer {
          background-size: 1000px 100%;
          animation: shimmer 3s infinite linear;
        }

        .animate-smooth-marquee {
          display: flex;
          width: max-content;
          animation: smoothMarquee 30s linear infinite;
        }

        /* Pause animation when reduced motion is preferred */
        @media (prefers-reduced-motion: reduce) {
          .animate-smooth-marquee {
            animation: none;
          }
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </section>
  );
}

"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slideImage from "@/assets/home/cheerful-students-library 1.png";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: slideImage,
    title: "Collaborative Learning",
    description: "Students working together to achieve academic excellence",
  },
  {
    id: 2,
    image: slideImage,
    title: "Interactive Sessions",
    description: "Engaging classroom discussions and activities",
  },
  {
    id: 3,
    image: slideImage,
    title: "Digital Learning",
    description: "Modern technology integrated into education",
  },
  {
    id: 4,
    image: slideImage,
    title: "Study Groups",
    description: "Peer-to-peer learning and support",
  },
  {
    id: 5,
    image: slideImage,
    title: "Academic Success",
    description: "Achieving goals through dedicated learning",
  },
];

const FeaturesSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-[60px] lg:py-[120px]  bg-white relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-default mb-6">
            Explore Our Features
          </h2>
          <p className="text-lg font-normal text-grey max-w-4xl mx-auto leading-relaxed">
            Browse our features to see how we&apos;re empowering the next generation
            of nontraditional learners to succeed.
          </p>
        </div>

        {/* Slider Container */}
        <div className="">
          {/* Main Slider */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[rgba(192,109,26,0.3)] to-[rgba(22,26,100,0.3)] max-w-[1000px] pt-12 mx-auto">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="w-full flex-shrink-0">
                  <div className="relative ">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      className="object-contain h-full lg:h-[312px]"
                    />
                    {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-96 top-[55%] -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full border border-[#0000CD66] flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-96 top-[55%] -translate-y-1/2 w-12 h-12 bg-primary hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-10 h-10 rounded-[4px] font-medium text-sm transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Auto-play functionality */}
      </div>
    </section>
  );
};

export default FeaturesSlider;

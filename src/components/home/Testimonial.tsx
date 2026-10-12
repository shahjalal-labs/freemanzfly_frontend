"use client";

import profile1 from "@/assets/home/profile/ppro1.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

interface Testimonial {
  id: number;
  name: string;
  image: StaticImageData;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Smith",
    image: profile1,
    content:
      "I was a little skeptical when I first shopped on this website, as there are many fake sites online. But this experience really surprised me. I bought a smartwatch and a mobile cover. After confirming the order, I received an SMS and an email with the delivery update. I received the product in just 48 hours – the packaging was very good, without any damage.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    image: profile1,
    content:
      "Amazing quality products and super fast delivery! I ordered headphones and they arrived the next day in perfect condition. The customer service team was also very helpful when I had questions about my order. Definitely recommend this store to everyone!",
  },
  {
    id: 3,
    name: "Mike Chen",
    image: profile1,
    content:
      "Best online shopping experience I've had in years. The website is easy to navigate, prices are competitive, and the product quality exceeded my expectations. I've already placed three more orders and will continue shopping here.",
  },
];

export default function Testimonial() {
  return (
    <section className="py-12 md:py-20 px-4 container mx-auto">
      <div className="mb-8 md:mb-12 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-default mb-4">
          What Our <span className="text-primary">Customers</span>
          <br className="hidden md:block" />
          Are Saying
        </h2>
      </div>

      <Carousel className="w-full">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id}>
              <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-6 md:gap-0">
                {/* Customer Image */}
                <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                  <div className="relative w-full aspect-[4/3] md:aspect-[5/3] rounded-2xl overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="relative bg-[#F9F9FB] py-8 md:py-12 lg:py-[160px] px-6 md:px-8 lg:px-[148px] rounded-2xl w-full">
                  {/* Large Quote Mark - Responsive */}
                  <div className="absolute top-4 md:top-6 lg:top-28 left-4 md:left-6 lg:left-5 text-[#E2E8F0] text-4xl md:text-6xl lg:text-8xl font-serif leading-none select-none">
                    <BiSolidQuoteAltLeft className="w-12 h-12 md:w-16 md:h-16 lg:w-[220px] lg:h-[200px]" />
                  </div>

                  <div className="relative z-10 pt-4 md:pt-6 lg:pt-8">
                    <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed">
                      {testimonial.content}
                    </p>
                    <div className="mt-4 md:mt-6 lg:mt-8">
                      <p className="text-lg md:text-xl font-semibold text-default">
                        {testimonial.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center md:justify-start gap-2 mt-6 md:mt-8">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600">
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </CarouselPrevious>
          <CarouselNext className="relative right-0 top-0 translate-y-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary text-white border-0 hover:bg-primary/90">
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </CarouselNext>
        </div>
      </Carousel>
    </section>
  );
}
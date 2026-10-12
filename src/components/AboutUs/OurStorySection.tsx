import storyImage from "@/assets/about/story.png";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function OurStorySection() {
  return (
    <section className="py-12 md:py-[60px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our <span className="text-primary">Story</span>
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                At FreemanZ LLC, we believe that being prepared is the first
                step to success. Born from personal experience and over 20 years
                in business, I saw how many workers — especially those on tight
                budgets — struggled to access the right tools, gear, and comfort
                items to get through the day.
              </p>
              <p>
                Whether you&apos;re punching in at an office, a construction site, or
                preparing for remote work from home, you deserve essentials that
                are practical, durable, and affordable.
              </p>
              <p>
                FreemanZ was created to bridge that gap — providing everyday
                items that make work easier and more productive.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href={`/contact`}
                className="bg-primary text-white px-8 py-3 rounded-full text-lg font-medium flex items-center w-fit"
              >
                Contact us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={storyImage.src}
                alt="Professional business team - man and woman in office setting"
                className="w-full h-full object-cover"
                width={600}
                height={450}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

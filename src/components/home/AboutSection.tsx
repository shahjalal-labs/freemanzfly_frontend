import about from "@/assets/home/about.png";
import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  return (
    <section className="lg:py-[120px] py-20 px-4 container mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Content */}
        <div className="space-y-6">
          {/* About Us Badge */}
          <div className="inline-block mb-4">
            <span className="bg-[#FC961A]/20 text-grey px-8 py-2 rounded-full text-sm font-medium">
              About us
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-default leading-tight">
            Live Free. Work Smart. Connect Everywhere
          </h2>

          <p className="text-grey leading-relaxed mt">
            FreemanZ LLC - Empowering people to work freely, together, anywhere.
          </p>

          {/* Description */}
          <p className="text-grey leading-relaxed">
            At FreemanZ LLC, we make work life easier with smart, reliable
            accessories designed for busy professionals. From USB ports and
            travel gear to coffee mugs and headphones, our products keep you
            organized, connected, and ready for anything.
          </p>

          {/* Learn More Button */}
          <Link
            href={`/about-us`}
            className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-full w-fit font-medium transition-colors duration-200 flex items-center gap-2"
          >
            Learn More
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-[622px] lg:h-[570px] bg-white">
          <Image src={about} alt="About Us" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}

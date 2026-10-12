import bitcoinIcon from "@/assets/about/bitcoin-03.png";
import heartIcon from "@/assets/about/heart.png";
import userIcons from "@/assets/about/user-group.png";
import Image from "next/image";

const values = [
  {
    icon: heartIcon,
    title: "Comfort Meets Function",
    description:
      "We believe everyday tools should work as hard as you do — delivering comfort, ease, and performance.",
  },
  {
    icon: bitcoinIcon,
    title: "Affordable Quality",
    description:
      "High standards shouldn't mean high prices — we deliver lasting quality with real value.",
  },
  {
    icon: userIcons,
    title: "Style for Every Professional",
    description:
      "Work-ready can look good too — clean, practical, and built for confidence.",
  },
];

export function WhatWeStandForSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-start mb-16">
          <h2 className="text-4xl md:text-[40px] font-semibold text-default mb-4">
            What We <span className="text-primary">Stand For</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="text-center bg-[#FBFBFB] p-4 border border-[#F3F4F6] shadow-sm rounded-3xl">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16">
                    <Image
                      src={IconComponent}
                      alt={value.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

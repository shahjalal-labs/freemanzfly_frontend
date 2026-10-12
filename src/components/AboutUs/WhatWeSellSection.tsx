import icon4 from "@/assets/about/airplane-take-off-4.png";
import icon3 from "@/assets/about/medical-mask3.png";
import icon1 from "@/assets/about/office1.png";
import icon2 from "@/assets/about/seat-selector2.png";
import icon6 from "@/assets/about/thermometer-cold6.png";
import icon5 from "@/assets/about/travel-bag5.png";
import Image from "next/image";

const categories = [
  {
    icon: icon1,
    title: "Office Essentials",
    description:
      "Planners, pens, sticky pads, briefcases, headphones, calculators",
  },
  {
    icon: icon2,
    title: "Comfort & Ergonomics",
    description: "Seat cushions, neck pillows, hydration vests, hand warmers",
  },
  {
    icon: icon3,
    title: "Workplace Safety Gear",
    description: "Knee pads, safety glasses, face shields, steel toe toppers",
  },
  {
    icon: icon4,
    title: "Travel & Mobility",
    description: "Luggage, suitcase locks, packing cubes, travel adaptors",
  },
  {
    icon: icon5,
    title: "Organization Tools",
    description: "Tool bags, storage equipment, folders, balance boards",
  },
  {
    icon: icon6,
    title: "Seasonal Wearables",
    description: "Face coverings, neck warmers, ear warmers, socks",
  },
];

export function WhatWeSellSection() {
  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="text-start mb-16">
        <h1 className="text-4xl md:text-[40px] font-semibold text-default mb-4">
          What We <span className="text-primary">Sell</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div
              key={index}
              className="text-center bg-[#FBFBFB] px-4 py-5 border border-[#F3F4F6] shadow-sm rounded-3xl"
            >
              <div className="flex justify-center mb-6">
                <Image
                  src={IconComponent}
                  alt={category.title}
                  className="w-16 h-16 "
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {category.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

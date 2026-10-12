import ctaBg from "@/assets/home/cta.png";
import Link from "next/link";

export default function TransformBanner() {
  return (
    <section className="pb-[120px]">
      <div className="container mx-auto px-4">
        <div
          className="relative rounded-2xl "
          style={{
            backgroundImage: `url(${ctaBg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[400px] ">
            {/* Left Content */}
            <div className="text-white space-y-6 p-8 lg:p-12 lg:pr-0 ">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight mb-12">
                Transform Your Student&apos;s FLVS Experience
              </h2>
              <Link href={`/explore-plans`}>
                <button className="bg-secondary text-white hover:bg-orange-300 px-8 py-[14px] font-semibold text-lg rounded-lg">
                  Explore Plans
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

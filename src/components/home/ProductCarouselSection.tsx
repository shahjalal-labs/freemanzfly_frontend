"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowUpRight } from "lucide-react";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  shortDescription: string;
  images: StaticImageData[];
  quantity: number; // Available stock quantity
  availability?: "InStock" | "PreOrder" | "OutOfStock";
}

interface ProductCarouselSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  showSeeAll?: boolean;
}

export function ProductCarouselSection({
  title,
  subtitle,
  products,
  showSeeAll = true,
}: ProductCarouselSectionProps) {
  console.log("products in carousel", products);

  // Check if products array is empty or undefined
  const isEmpty = !products || products.length === 0;

  const router = useRouter();

  const handleSeeAll = () => {
    router.push(`/product?sortBy=${"-createdAt"}`);
  };

  return (
    <section className="py-16 px-4 container mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-default mb-2">{title}</h2>
            <p className="text-[#94A3B8] max-w-2xl">{subtitle}</p>
          </div>
          {/* Buttons are part of this Carousel - Hide when no products */}
          {!isEmpty && (
            <div className="flex items-center gap-6 mt-10">
              <CarouselPrevious className="relative static  border rounded-full w-10 h-10 flex items-center justify-center " />
              <CarouselNext className="relative  static border rounded-full w-10 h-10 flex items-center justify-center " />
            </div>
          )}
        </div>

        {/* Products Carousel or Empty State */}
        {isEmpty ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Products not found
              </h3>
              <p className="text-gray-600">
                No products available at the moment. Please check back later.
              </p>
            </div>
          </div>
        ) : (
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <ProductCard {...product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Carousel>

      {/* See All Button - Only show when products exist */}
      {showSeeAll && !isEmpty && (
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSeeAll}
            className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center gap-2"
          >
            See all
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

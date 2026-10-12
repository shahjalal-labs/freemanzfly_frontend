"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  useGetAllCategoriesQuery,
  useGetAllCategoryProductsQuery,
} from "@/redux/api/productApi";
import { ArrowUpRight } from "lucide-react";
import { StaticImageData } from "next/image";
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

interface CategoriesSectionProps {
  products: Product[];
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function CategoriesSection({ products }: CategoriesSectionProps) {
  const router = useRouter();
  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useGetAllCategoriesQuery({});

  const [activeCategory, setActiveCategory] = useState("all");

  // Create categories array from API response with "All" category
  const categories = [
    { id: "all", label: "All" },
    ...(categoriesResponse?.result?.map((category: Category) => ({
      id: category.name,
      label: category.name,
    })) || []),
  ];

  // Fetch products based on category
  const { data: categoryProductsData, isLoading: productsLoading } =
    useGetAllCategoryProductsQuery(
      activeCategory === "all"
        ? { page: 1, limit: 10 } // Don't pass category param for "all"
        : { category: activeCategory, page: 1, limit: 10 },
    );

  // Use fetched products for specific categories, fallback to props for "all"
  const filteredProducts =
    activeCategory === "all"
      ? products
      : categoryProductsData?.result?.result || [];

  // Check if products array is empty
  const isEmpty = filteredProducts.length === 0;

  // Handle "See all" button click
  const handleSeeAllClick = () => {
    if (activeCategory === "all") {
      router.push("/product");
    } else {
      router.push(`/product?category=${encodeURIComponent(activeCategory)}`);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4 container mx-auto">
        <div className="text-center">Loading categories...</div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-16 px-4 container mx-auto">
        <div className="text-center text-red-500">Error loading categories</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 container mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative"
      >
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Our Categories
              </h2>
              <p className="text-gray-600 max-w-2xl">
                These are the products everyone is raving about — handpicked
                from our bestsellers, loved by thousands of customers across the
                country.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-16">
              <CarouselPrevious className="relative static  border rounded-full w-10 h-10 flex items-center justify-center " />
              <CarouselNext className="relative  static border rounded-full w-10 h-10 flex items-center justify-center " />
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              disabled={productsLoading}
              className={`rounded-full px-6 py-2 transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-primary hover:bg-orange-600 text-white"
                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
              } ${productsLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {category.label}
              {productsLoading && activeCategory === category.id && "..."}
            </Button>
          ))}
        </div>

        {/* Products Carousel */}
        {productsLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : isEmpty ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Products not found
              </h3>
              <p className="text-gray-600">
                No products available for the{" "}
                {activeCategory === "all"
                  ? "selected categories"
                  : activeCategory}{" "}
                category.
              </p>
            </div>
          </div>
        ) : (
          <CarouselContent className="-ml-4">
            {filteredProducts.map((product: Product) => (
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
      {!isEmpty && !productsLoading && (
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSeeAllClick}
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

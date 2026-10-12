"use client";
import { AboutSection } from "@/components/home/AboutSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import HeroSection from "@/components/home/HeroSection";
import { ProductCarouselSection } from "@/components/home/ProductCarouselSection";
import Testimonial from "@/components/home/Testimonial";
import {
  useGetAllCategoryProductsQuery,
  useGetBestSellingProductsQuery,
  useGetNewArrivalProductsQuery,
} from "@/redux/api/productApi";

export default function Page() {
  const { data: newArrivalsProductsData } = useGetNewArrivalProductsQuery({
    sort: "-createdAt",
    page: 1,
    limit: 10,
  });

  const newArrivalsProducts = newArrivalsProductsData?.result?.result || [];

  // Fetch some initial products for the "All" category
  const { data: initialProductsData } = useGetAllCategoryProductsQuery({
    page: 1,
    limit: 10,
  });

  const initialProducts = initialProductsData?.result?.result || [];

  // best selling products
  const { data: bestSellingProductsData } = useGetBestSellingProductsQuery({});
  const bestSellingProducts = bestSellingProductsData?.result || [];
  console.log("bestSellingProducts", bestSellingProducts);

  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ProductCarouselSection
        title="Best selling Products"
        subtitle="Top-rated professional work accessories and ergonomic essentials."
        products={bestSellingProducts}
      />
      <ProductCarouselSection
        title="New Arrivals"
        subtitle="Discover our latest travel gear and workplace safety tools."
        products={newArrivalsProducts}
      />
      <CategoriesSection products={initialProducts} />
      <Testimonial />
    </div>
  );
}

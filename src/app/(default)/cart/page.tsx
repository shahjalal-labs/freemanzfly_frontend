"use client";
import Cart from "@/components/Cart/Cart";
import { ProductCarouselSection } from "@/components/home/ProductCarouselSection";
import { useGetNewArrivalProductsQuery } from "@/redux/api/productApi";

function Page() {
  const { data: newArrivalsProductsData } = useGetNewArrivalProductsQuery({
    sort: "-createdAt",
    page: 1,
    limit: 10,
  });

  const newArrivalsProducts = newArrivalsProductsData?.result?.result || [];
  return (
    <div>
      <Cart />
      <ProductCarouselSection
        title="Similar Products"
        subtitle="These are the products everyone is raving about — handpicked from our bestsellers, loved by thousands of customers across the country."
        products={newArrivalsProducts}
      />
    </div>
  );
}

export default Page;

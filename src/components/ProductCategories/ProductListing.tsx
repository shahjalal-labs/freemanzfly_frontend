/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetCategoriesProductsQuery } from "@/redux/api/productApi";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "../home/ProductCard";

import { Loader2 } from "lucide-react";
import { StaticImageData } from "next/image";
import Pagination from "../ui/pagination";
import { ProductFilters } from "./ProductFilters";
import { SortDropdown } from "./SortDropdown";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  shortDescription: string;
  images: StaticImageData[];
  category: string;
  brand?: string;
  availability?: "InStock" | "PreOrder" | "OutOfStock";
  quantity: number;
}

export function ProductListing() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    priceRange: [0, 200] as [number, number],
    availability: [] as string[],
    brands: [] as string[],
  });

  // Build query parameters
  const buildQueryParams = () => {
    const params: any = {
      page: currentPage,
      limit: 20,
    };

    // Add category if exists
    if (category) {
      params.productCategory = category;
    }

    // Add price range
    if (filters.priceRange[0] > 0) {
      params.startPrice = filters.priceRange[0];
    }
    if (filters.priceRange[1] < 200) {
      params.endPrice = filters.priceRange[1];
    }

    // Add availability
    if (filters.availability.length > 0) {
      params.availability = filters.availability.join(",");
    }

    // Add brands
    if (filters.brands.length > 0) {
      params.brand = filters.brands.join(",");
    }

    // Add sorting
    if (sortBy !== "default") {
      switch (sortBy) {
        case "price-low-high":
          params.sort = "price"; // Low to high: -price
          break;
        case "price-high-low":
          params.sort = "-price"; // High to low: createdAt
        default:
          break;
      }
    }

    return params;
  };

  // Get products data
  const { data: productsData, isLoading } =
    useGetCategoriesProductsQuery(buildQueryParams());

  // Extract products and pagination info
  const products = productsData?.result?.result || [];
  const paginationMeta = productsData?.meta || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, category]);

  // Generate title based on category
  const title = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
    : "All Products";

  return (
    <div className="container mx-auto px-4 pb-20 lg:pt-60">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-secondary py-4 px-6 rounded-[8px]">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
              {title}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-default font-medium">Sort By:</span>
              <SortDropdown value={sortBy} onValueChange={setSortBy} />
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 flex items-center justify-center">
                {" "}
                <Loader2 className="animate-spin" size={25} /> Loading
                products...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {products?.map((product: Product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* No Results */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pagination - Only show if there are multiple pages */}
      {paginationMeta.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            totalPage={paginationMeta.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

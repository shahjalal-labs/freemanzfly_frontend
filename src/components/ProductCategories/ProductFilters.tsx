"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Slider } from "@/components/ui/Slider";
import { useGetAllBrandsQuery } from "@/redux/api/productApi";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FilterState {
  priceRange: [number, number];
  availability: string[];
  brands: string[];
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

// Brand type definition
interface Brand {
  id: string;
  name: string;
}

export function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    availability: true,
    brand: true,
  });

  const {
    data: getAllBrandsData,
    isLoading,
    isError,
  } = useGetAllBrandsQuery({});

  // Type-safe brand data with fallback
  const allBrands: Brand[] = getAllBrandsData?.result || [];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange({
      ...filters,
      priceRange: value,
    });
  };

  const handleAvailabilityChange = (value: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, value]
      : filters.availability.filter((item) => item !== value);

    onFiltersChange({
      ...filters,
      availability: newAvailability,
    });
  };

  const handleBrandChange = (value: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, value]
      : filters.brands.filter((item) => item !== value);

    onFiltersChange({
      ...filters,
      brands: newBrands,
    });
  };

  return (
    <div className="w-full max-w-xs space-y-4">
      {/* Price Range */}
      <Card className="bg-[#F8FAFC] border-none">
        <h3 className="font-medium text-gray-900 mb-4 rounded-tl-[8px] rounded-tr-[8px] bg-secondary py-[10px] px-4">
          Price Range
        </h3>
        <div className="space-y-4 px-4 pb-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={10000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </Card>

      {/* Availability */}
      <Card className="bg-[#F8FAFC] border-none">
        <Button
          variant="ghost"
          onClick={() => toggleSection("availability")}
          className="w-full justify-between p-0 h-auto font-medium bg-secondary py-[10px] px-4 text-gray-900 hover:bg-none rounded-tl-[8px] rounded-tr-[8px]"
        >
          Availability
          {expandedSections.availability ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expandedSections.availability && (
          <div className="mt-4 space-y-3 px-4 pb-4">
            {["InStock", "PreOrder", "UpComming", "OutOfStock"].map(
              (option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`availability-${option}`}
                    checked={filters.availability.includes(option)}
                    onCheckedChange={(checked) =>
                      handleAvailabilityChange(option, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`availability-${option}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              )
            )}
          </div>
        )}
      </Card>

      {/* Brand */}
      <Card className="bg-[#F8FAFC] border-none">
        <Button
          variant="ghost"
          onClick={() => toggleSection("brand")}
          className="w-full justify-between p-0 h-auto font-medium bg-secondary py-[10px] px-4 text-gray-900 hover:bg-none rounded-tl-[8px] rounded-tr-[8px]"
        >
          Brand
          {expandedSections.brand ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expandedSections.brand && (
          <div className="mt-4 space-y-3 px-4 pb-4">
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center py-4">
                <p className="text-sm text-red-600">Failed to load brands</p>
              </div>
            )}

            {/* No Brands Available */}
            {!isLoading && !isError && allBrands.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No brands available</p>
              </div>
            )}

            {/* Brands List */}
            {!isLoading && !isError && allBrands.length > 0 && (
              <>
                {allBrands.map((brand: Brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={filters.brands.includes(brand.name)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand.name, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {brand.name}
                    </label>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import logo from "@/assets/home/logo.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropDown";
import { Input } from "@/components/ui/input";
import {
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
} from "@/redux/api/productApi";
import { useGetMyProfileQuery } from "@/redux/api/userApi";
import { RootState } from "@/redux/store";
import Cookies from "js-cookie";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoBagOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  productCategory: string;
  [key: string]: any;
}

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: myProfileData } = useGetMyProfileQuery({});
  console.log("myProfileData", myProfileData);

  const userInfo = myProfileData?.result;
  const token = Cookies.get("accessToken");

  // all products data
  const { data: myAllProductsData } = useGetAllProductsQuery({
    page: 1,
    limit: 1000,
  });

  const products = myAllProductsData?.result?.result || [];

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery({});

  // Get categories from API response
  const categories = categoriesResponse?.result || [];

  const router = useRouter();
  const pathname = usePathname();
  const cartTotalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );

  const suggestions = useMemo<{ products: Product[]; categories: string[] }>(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return {
        products: [],
        categories: [],
      };
    }

    const matchedProducts = products.filter((product: Product) =>
      product.name.toLowerCase().includes(query)
    );

    const matchedCategories = categories
      .filter((category: Category) =>
        category.name.toLowerCase().includes(query)
      )
      .map((category: Category) => category.name);

    const productCategories = Array.from(
      new Set(
        products
          .filter((product: Product) =>
            product.productCategory?.toLowerCase().includes(query)
          )
          .map((product: Product) => product.productCategory)
          .filter(Boolean)
      )
    ) as string[];

    const allCategories = Array.from(
      new Set([...matchedCategories, ...productCategories])
    );

    return {
      products: matchedProducts.slice(0, 5),
      categories: allCategories.slice(0, 5),
    };
  }, [searchQuery, products, categories]);

  const shouldShowSuggestions =
    showSuggestions &&
    searchQuery.trim() !== "" &&
    (suggestions.products.length > 0 || suggestions.categories.length > 0);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const handleAddToCart = () => {
    router.push("/cart");
  };

  // Function to handle category click
  const handleCategoryClick = (categoryName: string) => {
    router.push(`/product?category=${encodeURIComponent(categoryName)}`);
    setIsDrawerOpen(false);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Function to handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to products page with search query as category parameter
      router.push(`/product?category=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  // Function to handle suggestion click
  const handleSuggestionClick = (type: 'product' | 'category', value: string) => {
    if (type === 'category') {
      router.push(`/product?category=${encodeURIComponent(value)}`);
    } else {
      // For products, use their category if available, otherwise use the product name
      const product = products.find((p: Product) => p.name === value);
      const categoryToUse = product?.productCategory || value;
      router.push(`/product?category=${encodeURIComponent(categoryToUse)}`);
    }
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Function to handle input key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Smooth open drawer function
  const openDrawer = () => {
    setIsDrawerAnimating(true);
    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 200);
  };

  // Smooth close drawer function
  const closeDrawer = () => {
    setIsDrawerAnimating(true);
    setIsDrawerOpen(false);
    setTimeout(() => {
      setIsDrawerAnimating(false);
    }, 300);
  };

  // Function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Function to get link styles based on active state
  const getLinkStyles = (href: string) => {
    const baseStyles =
      "font-medium hover:text-orange-600 transition-colors duration-200";
    const activeStyles = "text-orange-500";
    const inactiveStyles = "text-gray-700 hover:text-orange-500";

    return `${baseStyles} ${
      isActiveLink(href) ? activeStyles : inactiveStyles
    }`;
  };

  // Function to get mobile link styles based on active state
  const getMobileLinkStyles = (href: string) => {
    const baseStyles =
      "block py-3 px-4 rounded-md transition-all duration-200 active:scale-95";
    const activeStyles = "text-orange-500 font-medium bg-orange-50";
    const inactiveStyles =
      "text-gray-700 hover:bg-orange-50 hover:text-orange-500";

    return `${baseStyles} ${
      isActiveLink(href) ? activeStyles : inactiveStyles
    }`;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button and Logo */}
            <div className="flex items-center space-x-4">
              <Link href={`/`} className="flex items-center space-x-2">
                <Image
                  src={logo}
                  className="w-[80px] object-cover"
                  alt="logo"
                />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for product..."
                  className="w-full pl-4 pr-12 py-6 rounded-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                />
                <Button
                  size="lg"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-primary w-10 h-10 p-0 border-none active:border-none active:outline-none"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5 text-white" />
                </Button>
              </div>

              {/* Search Suggestions Dropdown */}
              {shouldShowSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {/* Category Suggestions */}
                  {suggestions.categories.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">
                        Categories
                      </div>
                      {suggestions.categories.map((category, index) => (
                        <div
                          key={`category-${index}`}
                          className="px-3 py-2 hover:bg-orange-50 cursor-pointer rounded-md transition-colors duration-200"
                          onClick={() => handleSuggestionClick("category", category)}
                        >
                          <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product Suggestions */}
                  {suggestions.products.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">
                        Products
                      </div>
                      {suggestions.products.map((product) => (
                        <div
                          key={product.id}
                          className="px-3 py-2 hover:bg-orange-50 cursor-pointer rounded-md transition-colors duration-200"
                          onClick={() => handleSuggestionClick("product", product.name)}
                        >
                          <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{product.name}</span>
                            {product.productCategory && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {product.productCategory}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleAddToCart}
                variant={"link"}
                className="relative p-2 hover:bg-none"
              >
                <div className="w-10 h-10 border border-[#CBD5E1] rounded-full flex items-center justify-center relative">
                  <IoBagOutline className="w-6 h-6 text-[#FF4D4F]" />
                  <Badge className="absolute -top-1 -right-1 bg-[#FF4D4F] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {cartTotalQuantity || 0}
                  </Badge>
                </div>
                <span className="ml-2 hidden sm:inline font-normal text-default text-[18px]">
                  Cart
                </span>
              </Button>

              {token ? (
                <Link href={"/profile"} className="p-2 flex items-center">
                  <div className="w-10 h-10 border border-[#CBD5E1] rounded-full flex items-center justify-center">
                    <Image
                      src={userInfo?.profileImage || "/default-profile.png"}
                      alt="Profile Picture"
                      className="w-6 h-6 rounded-full"
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="ml-2 hidden sm:inline font-normal text-default text-[18px]">
                    My Profile
                  </span>
                </Link>
              ) : (
                <Link href={"/login"} className="p-2 flex items-center">
                  <div className="w-10 h-10 border border-[#CBD5E1] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="ml-2 hidden sm:inline font-normal text-default text-[18px]">
                    Login
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar - Appears below main navbar when toggled */}
          {isSearchVisible && (
            <div className="mt-4 md:hidden relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for product..."
                  className="w-full pl-4 pr-12 py-5 rounded-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                />
                <Button
                  size="lg"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-primary w-8 h-8 p-0 border-none active:border-none active:outline-none"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 text-white" />
                </Button>
              </div>

              {/* Mobile Search Suggestions */}
              {shouldShowSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {/* Category Suggestions */}
                  {suggestions.categories.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">
                        Categories
                      </div>
                      {suggestions.categories.map((category, index) => (
                        <div
                          key={`category-${index}`}
                          className="px-3 py-2 hover:bg-orange-50 cursor-pointer rounded-md transition-colors duration-200"
                          onClick={() => handleSuggestionClick("category", category)}
                        >
                          <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product Suggestions */}
                  {suggestions.products.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1">
                        Products
                      </div>
                      {suggestions.products.map((product) => (
                        <div
                          key={product.id}
                          className="px-3 py-2 hover:bg-orange-50 cursor-pointer rounded-md transition-colors duration-200"
                          onClick={() => handleSuggestionClick("product", product.name)}
                        >
                          <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{product.name}</span>
                            {product.productCategory && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {product.productCategory}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Bar */}
        <div className="bg-[#F9F9FB] py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              {/* Category Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-orange-600 text-white rounded-full px-6 py-6 cursor-pointer flex items-center space-x-2"
                    disabled={categoriesLoading}
                  >
                    <Menu className="w-4 h-4" />
                    <span>Category</span>
                    <ChevronDown className="w-4 h-4" />
                    {categoriesLoading && "..."}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                  {categoriesLoading ? (
                    <DropdownMenuItem disabled>
                      Loading categories...
                    </DropdownMenuItem>
                  ) : categoriesError ? (
                    <DropdownMenuItem disabled>
                      Error loading categories
                    </DropdownMenuItem>
                  ) : categories.length === 0 ? (
                    <DropdownMenuItem disabled>
                      No categories found
                    </DropdownMenuItem>
                  ) : (
                    categories.map((category: Category) => (
                      <DropdownMenuItem
                        key={category.id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className={getLinkStyles("/")}>
                  Home
                </Link>
                <Link href="/contact" className={getLinkStyles("/contact")}>
                  Contact
                </Link>
                <Link href="/about-us" className={getLinkStyles("/about-us")}>
                  About us
                </Link>
              </nav>

              <button
                className="md:hidden p-2"
                onClick={openDrawer}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isDrawerOpen || isDrawerAnimating ? "block" : "hidden"
        }`}
      >
        {/* Backdrop with fade animation */}
        <div
          className={`fixed inset-0 bg-black transition-all duration-300 ease-in-out ${
            isDrawerOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
          }`}
          onClick={closeDrawer}
        />

        {/* Drawer with smooth slide animation */}
        <div
          className={`fixed left-0 top-0 h-full w-80 max-w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <Image
              src={logo}
              className="w-[75px] object-contain"
              width={75}
              height={75}
              alt="logo"
            />
            <button
              onClick={closeDrawer}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-full">
            {/* Navigation Links */}
            <div className="mb-6">
              <div className="grid gap-2">
                <Link
                  href="/"
                  className={getMobileLinkStyles("/")}
                  onClick={closeDrawer}
                >
                  Home
                </Link>
                <Link
                  href="/contact"
                  className={getMobileLinkStyles("/contact")}
                  onClick={closeDrawer}
                >
                  Contact
                </Link>
                <Link
                  href="/about-us"
                  className={getMobileLinkStyles("/about-us")}
                  onClick={closeDrawer}
                >
                  About us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close suggestions when clicking outside */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </>
  );
}
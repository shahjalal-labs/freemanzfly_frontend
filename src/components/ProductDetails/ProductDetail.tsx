/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { addToCart } from "@/redux/allSlice/cartSlice";
import { useGetSingleProductDetailsQuery } from "@/redux/api/productApi";
import { RootState } from "@/redux/store";
import { colors } from "@/utilities/color";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Pagination from "../ui/pagination";
import { useSearchParams } from "next/navigation";

type ProductDetailProps = {
  productId?: string;
};
// Helper to find color by name or hex
function findColor(colorValue: string) {
  if (!colorValue) return null;
  // Try name match (case-insensitive)
  const byName = colors.find(
    (c) => c.name.toLowerCase() === colorValue.toLowerCase(),
  );
  if (byName) return byName;
  // Try hex match (normalize)
  const normalized = colorValue.startsWith("#")
    ? colorValue.toLowerCase()
    : `#${colorValue.toLowerCase()}`;
  const byHex = colors.find((c) => c.hex.toLowerCase() === normalized);
  return byHex || null;
}

export function ProductDetail() {
  const params = useSearchParams();
  const productId = params.get("id") || undefined;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specifications");
  const [currentReviewPage, setCurrentReviewPage] = useState(1);

  const dispatch = useDispatch();

  // Get cart items and find existing cart item
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const existingCartItem = productId
    ? cartItems.find((item) => item.id === productId)
    : null;
  const cartQuantity = existingCartItem?.quantity || 0;

  const reviewsPerPage = 4;

  const {
    data: singleProductDetailsData,
    isLoading,
    error,
  } = useGetSingleProductDetailsQuery(productId ?? skipToken);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 lg:pt-60">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg flex items-center justify-center">
            <Loader2 className="animate-spin" size={30} /> Loading product
            details...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !singleProductDetailsData?.result) {
    return (
      <div className="container mx-auto px-4 py-20 lg:pt-60">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">
            Error loading product details
          </div>
        </div>
      </div>
    );
  }

  const product = singleProductDetailsData.result;
  const availableQuantity = product?.quantity || 0;
  const normalizedAvailability =
    product?.availability === "OutOfStock" ||
    product?.availability === "PreOrder"
      ? product.availability
      : "InStock";
  const isOutOfStock =
    normalizedAvailability === "OutOfStock" || availableQuantity <= 0;
  const isPreOrder = normalizedAvailability === "PreOrder";

  // Transform API data to match your component's expected structure
  const transformedProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    rating: product.rating || 0,
    reviewCount: product.reviews?.length || 0,
    description: product.description,
    images: product.images || ["/placeholder.svg"],
    features: {
      model: product.brand,
      frequency: product.technicalSpecification?.display,
      sensitivity: "108dB±3dB", // Default value
      impedance: "32Ω", // Default value
      driver: "40mm", // Default value
    },
    specifications: {
      technical: {
        driverMagnet: product.technicalSpecification?.memory || "40mm",
        frequencyRange: "20 Hz - 20kHz", // Default value
        impedance: product.technicalSpecification?.processor ? "32Ω" : "32Ω",
        sensitivity: "108dB±3dB", // Default value
        inputJack: "3.5 Mm", // Default value
      },
      physical: {
        color: product.physicalSpecification?.color || "Black",
        cableLength: product.physicalSpecification?.dimensions || "4.10 ft.",
      },
      warranty: {
        manufacturing:
          product.warrantyInformation?.warrantyPeriod || "01 Year Warranty",
      },
    },
    reviews:
      product?.reviews?.map((review: any, index: number) => ({
        id: review.id || `review-${index}`,
        name:
          `${review?.user?.firstName} ${review?.user?.lastName}` || "Anonymous",
        avatar:
          review.user?.profileImage || "/placeholder.svg?height=48&width=48",
        rating: review.rating || 5,
        comment: review.comment || "No comment provided",
        timeAgo: review.createdAt
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            }).format(new Date(review.createdAt))
          : "Recently",
      })) || [],
  };

  // Default reviews if no reviews from API
  const allReviews =
    transformedProduct.reviews.length > 0 ? transformedProduct.reviews : [];

  const totalReviewPages = Math.ceil(allReviews.length / reviewsPerPage);
  const startIndex = (currentReviewPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = allReviews.slice(startIndex, endIndex);

  const nextImage = () => {
    setSelectedImageIndex(
      (prev) => (prev + 1) % transformedProduct.images.length,
    );
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) =>
        (prev - 1 + transformedProduct.images.length) %
        transformedProduct.images.length,
    );
  };

  const handleAddToCart = () => {
    if (!product || !productId) return;

    if (isOutOfStock) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }

    // Check if product is already in cart
    if (existingCartItem) {
      // Check if adding more would exceed available quantity
      const newTotalQuantity = cartQuantity + quantity;
      if (newTotalQuantity > availableQuantity) {
        toast.error(
          `Only ${availableQuantity} items available! You already have ${cartQuantity} in cart.`,
        );
        return;
      }

      // Add the selected quantity to existing product
      for (let i = 0; i < quantity; i++) {
        dispatch(
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "/placeholder.svg",
            maxQuantity: availableQuantity,
          }),
        );
      }
      toast.success(`Added ${quantity} more ${product.name} to cart!`);
    } else {
      // Add new product to cart with selected quantity
      for (let i = 0; i < quantity; i++) {
        dispatch(
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "/placeholder.svg",
            maxQuantity: availableQuantity,
          }),
        );
      }
      toast.success(`${quantity} ${product.name} added to cart!`);
    }

    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };

  // Check if cart quantity reached maximum available quantity
  const isMaxQuantityReached =
    !isOutOfStock && cartQuantity >= availableQuantity;

  return (
    <div>
      <div className="container mx-auto px-4 pb-20 pt-[20] lg:pt-60">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <span>Product Listing</span>
          <span>{">"}</span>
          <span>{product.productCategory || "Electronics"}</span>
          <span>{">"}</span>
          <span className="text-default">{transformedProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="relative overflow-hidden bg-gray-50 aspect-square">
              <Image
                src={
                  transformedProduct.images[selectedImageIndex] ||
                  "/placeholder.svg"
                }
                alt={transformedProduct.name}
                fill
                className="object-cover"
                priority
              />
            </Card>

            {/* Thumbnail Carousel */}
            <div className="relative">
              <div className="flex gap-[18px] overflow-hidden">
                {transformedProduct.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 p-2 transition-colors rounded-[18px] ${
                      selectedImageIndex === index
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${transformedProduct.name} view ${index + 1}`}
                      width={95}
                      height={95}
                      className="w-full h-full object-cover rounded-[18px]"
                    />
                  </button>
                ))}
              </div>

              {/* Navigation Arrows */}
              {transformedProduct.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevImage}
                    className="absolute -left-7 top-1/2 -translate-y-1/2 -translate-x-2 w-12 h-12 rounded-full border-none bg-primary shadow-md hover:bg-gray-50 text-white hover:text-default"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextImage}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-2 bg-primary shadow-md hover:bg-gray-50 w-12 h-12 rounded-full text-white hover:text-default"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-default mb-4">
                {transformedProduct.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl font-bold text-default">
                  ${transformedProduct.price.toFixed(2)}
                </span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    isOutOfStock
                      ? "bg-red-100 text-red-600"
                      : isPreOrder
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of stock"
                    : isPreOrder
                      ? "Pre-order"
                      : "In stock"}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(transformedProduct.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({transformedProduct.reviewCount} review)
                  </span>
                </div>
              </div>

              <p className="text-grey leading-relaxed border-t border-[#E2E8F0] pt-6">
                {transformedProduct.description}
              </p>
            </div>

            {/* Variant Color Display */}
            {Array.isArray(product.varients) && product.varients.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-default mb-2">
                  Color
                </h3>
                <div className="flex gap-4">
                  {product.varients.map((variant: any) => {
                    const colorObj = findColor(variant.color);
                    return (
                      <div key={variant.id} className="flex items-center gap-2">
                        <span
                          className="inline-block w-6 h-6 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: colorObj
                              ? colorObj.hex
                              : variant.color,
                          }}
                          title={colorObj ? colorObj.name : variant.color}
                        ></span>
                        <span className="text-sm">
                          {colorObj ? colorObj.name : variant.color}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold text-default mb-4">
                Key Features
              </h3>
              <ul className="space-y-4 text-grey">
                {transformedProduct.features.model && (
                  <li>• Brand: {transformedProduct.features.model}</li>
                )}
                {transformedProduct.features.frequency && (
                  <li>• Display: {transformedProduct.features.frequency}</li>
                )}
                {product.technicalSpecification?.processor && (
                  <li>
                    • Processor: {product.technicalSpecification.processor}
                  </li>
                )}
                {product.technicalSpecification?.graphics && (
                  <li>• Graphics: {product.technicalSpecification.graphics}</li>
                )}
                {product.technicalSpecification?.memory && (
                  <li>• Memory: {product.technicalSpecification.memory}</li>
                )}
              </ul>
              <Button variant="link" className="text-primary p-0 mt-2">
                View More Info
              </Button>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-full">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="h-10 w-10 rounded-full hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={
                    isOutOfStock || quantity + cartQuantity >= availableQuantity
                  }
                  className="h-10 w-10 rounded-full hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 w-1/2">
              <Button
                variant="outline"
                size={"lg"}
                className="flex-1 px-6  border-none bg-primary py-6 text-white rounded-[100px] hover:bg-primary/90 hover:text-white hover:duration-300"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isMaxQuantityReached}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : isMaxQuantityReached
                    ? "Max Quantity Added"
                    : isPreOrder
                      ? "Pre-order Now"
                      : "Add to Cart"}
              </Button>
              {/* <Button
                size={"lg"}
                className="flex-1 py-6 px-6 bg-primary text-white rounded-[100px] hover:bg-transparent hover:border hover:border-default hover:text-default hover:duration-300"
              >
                Buy Now
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-[#FBFBFB] py-[60px]">
        {/* Tab Navigation */}
        <div className="container mx-auto px-4">
          <div className="">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("specifications")}
                className={`py-4 px-1 font-normal text-[20px] transition-colors ${
                  activeTab === "specifications"
                    ? "text-default font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 font-normal text-[20px] transition-colors ${
                  activeTab === "description"
                    ? "text-default font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 font-normal text-[20px] transition-colors ${
                  activeTab === "reviews"
                    ? "text-default font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div className="space-y-8">
                {/* Technical Specification */}
                {product.technicalSpecification &&
                  Object.keys(product.technicalSpecification).length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Technical Specification
                      </h3>
                      <div className="rounded-lg overflow-hidden">
                        <table className="w-full">
                          <tbody>
                            {Object.entries(product.technicalSpecification).map(
                              ([key, value], index) => (
                                <tr
                                  key={key}
                                  className={
                                    index % 2 === 0 ? "bg-gray-50" : ""
                                  }
                                >
                                  <td className="py-3  text-gray-600 font-medium w-1/2 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </td>
                                  <td className="py-3  text-gray-900 w-1/2">
                                    {String(value || "N/A")}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* Physical Specification */}
                {product.physicalSpecification &&
                  Object.keys(product.physicalSpecification).length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Physical Specification
                      </h3>
                      <div className="rounded-lg overflow-hidden">
                        <table className="w-full">
                          <tbody>
                            {Object.entries(product.physicalSpecification).map(
                              ([key, value], index) => (
                                <tr
                                  key={key}
                                  className={
                                    index % 2 === 0 ? "bg-gray-50" : ""
                                  }
                                >
                                  <td className="py-3  text-gray-600 font-medium w-1/2 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </td>
                                  <td className="py-3  text-gray-900 w-1/2">
                                    {String(value || "N/A")}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* Warranty Information */}
                {product.warrantyInformation &&
                  Object.keys(product.warrantyInformation).length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Warranty Information
                      </h3>
                      <div className="rounded-lg overflow-hidden">
                        <table className="w-full">
                          <tbody>
                            {Object.entries(product.warrantyInformation).map(
                              ([key, value], index) => (
                                <tr
                                  key={key}
                                  className={
                                    index % 2 === 0 ? "bg-gray-50" : ""
                                  }
                                >
                                  <td className="py-3  text-gray-600 font-medium w-1/2 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </td>
                                  <td className="py-3  text-gray-900 w-1/2">
                                    {String(value || "N/A")}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* Fallback if no specifications exist */}
                {(!product.technicalSpecification ||
                  Object.keys(product.technicalSpecification).length === 0) &&
                  (!product.physicalSpecification ||
                    Object.keys(product.physicalSpecification).length === 0) &&
                  (!product.warrantyInformation ||
                    Object.keys(product.warrantyInformation).length === 0) && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No specifications available for this product.
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {transformedProduct.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.longDescription || transformedProduct.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Buy {transformedProduct.name} from Our Store
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get the original {transformedProduct.name} from our store.
                    We have a large collection of the latest{" "}
                    {product.brand || "brand"}
                    products available. Order online or visit your nearest store
                    to get yours at the best price.
                    {product.warrantyInformation?.warrantyPeriod &&
                      ` This product comes with a ${product.warrantyInformation.warrantyPeriod} warranty.`}
                  </p>
                </div>
              </div>
            )}

            {/* Reviews Tab */}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {Array.isArray(currentReviews) && currentReviews.length > 0 ? (
                  currentReviews.map((review: any) => (
                    <Card
                      key={review.id}
                      className="p-6 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start space-x-4">
                        <Image
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {review.name}
                            </h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-2">
                            {review.comment}
                          </p>
                          <span className="text-sm text-gray-400">
                            {review.timeAgo}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {typeof currentReviews === "string"
                        ? currentReviews
                        : "No reviews yet. Be the first to review this product!"}
                    </p>
                  </div>
                )}

                {Array.isArray(currentReviews) && totalReviewPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      totalPage={totalReviewPages}
                      currentPage={currentReviewPage}
                      setCurrentPage={setCurrentReviewPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

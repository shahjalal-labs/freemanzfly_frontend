/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useGetMyOrdersQuery,
  useSendReviewMutation,
} from "@/redux/api/orderApi";
import { useGetMyProfileQuery } from "@/redux/api/userApi";
import { ChevronDown, Loader2, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  images?: string[];
}

interface OrderProductItem {
  product: Product;
}

interface Order {
  status: string;
  products: OrderProductItem[];
}

interface OrdersData {
  result?: {
    result?: Order[];
  };
}

interface DeliveredProduct {
  id: string;
  name: string;
  image: string;
}

const Feedback = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: myProfileData } = useGetMyProfileQuery({});
  const userInfo = myProfileData?.result;

  const { data: myOrdersData } = useGetMyOrdersQuery({
    page: 1,
    limit: 100,
  });

  const [sendReviewFn, { isLoading }] = useSendReviewMutation();

  // Get delivered products from orders
  const deliveredProducts: DeliveredProduct[] =
    (myOrdersData as OrdersData)?.result?.result?.flatMap((order: Order) =>
      order.status === "Delivered"
        ? order.products.map((item: OrderProductItem) => ({
            id: item.product.id,
            name: item.product.name,
            image: item.product.images?.[0] || "/default-product.png",
          }))
        : []
    ) || [];

  // Remove duplicates
  const uniqueDeliveredProducts = deliveredProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex: number) => {
    setHoveredRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleProductSelect = (product: DeliveredProduct) => {
    setSelectedProduct(product.name);
    setSelectedProductId(product.id);
    setIsDropdownOpen(false);
  };

  const handlePostReview = async () => {
    if (!selectedProductId || !review.trim() || rating === 0) {
      toast.error("Please fill all fields before submitting");
      return;
    }

    console.log({
      productId: selectedProductId,
      productName: selectedProduct,
      review: review,
      rating: rating,
    });

    try {
      const response = await sendReviewFn({
        id: selectedProductId,
        data: {
          rating: rating, 
          comment: review,
        },
      }).unwrap();

      if (response?.success) {
        setSelectedProduct("");
        setSelectedProductId("");
        setReview("");
        setRating(0);
        toast.success("Review submitted successfully");
      }
    } catch (error: any) {
      console.error("Review submission error:", error);
      
      // More detailed error handling
      if (error?.data?.errors) {
        const errorMessages = error.data.errors.map((err: any) => err.message).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white pt-12 rounded-2xl max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Your Feedback
      </h1>

      <div className="flex items-start gap-6 border border-[#ADADAD3D] shadow-sm rounded-2xl p-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={userInfo?.profileImage || "/default-profile.png"}
              alt="User profile"
              className="w-full h-full object-cover"
              width={64}
              height={64}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 space-y-6">
          {/* Product Section */}
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-3">
              Product
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 text-left border border-[#CBD5E1] rounded-xl bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 flex items-center justify-between"
              >
                <span className={selectedProduct ? "text-gray-900" : "text-gray-400"}>
                  {selectedProduct || "Select Product"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#CBD5E1] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {uniqueDeliveredProducts.length > 0 ? (
                    uniqueDeliveredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors duration-150 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="truncate">{product.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No delivered products found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Review Textarea */}
          <div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full px-4 py-4 border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
              rows={6}
            />
          </div>

          {/* Rating and Submit Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-900">
                Your Ratings:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <button
                    key={starIndex}
                    onClick={() => handleStarClick(starIndex)}
                    onMouseEnter={() => handleStarHover(starIndex)}
                    onMouseLeave={handleStarLeave}
                    className="p-1 transition-colors duration-150"
                    type="button"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors duration-150 ${
                        starIndex <= (hoveredRating || rating)
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300 hover:text-orange-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <span className="text-sm text-gray-600">({rating} star{rating !== 1 ? 's' : ''})</span>
              )}
            </div>

            <button
              onClick={handlePostReview}
              disabled={!selectedProductId || !review.trim() || rating === 0 || isLoading}
              className="px-8 py-3 bg-orange-400 text-white rounded-full font-medium hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Submitting...
                </>
              ) : (
                "Post Review"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
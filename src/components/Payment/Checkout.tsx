/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { clearSelectedItems } from "@/redux/allSlice/cartSlice";
import {
  useOrderCashOnDeliveryMutation,
  useOrderOnlinePaymentMutation,
} from "@/redux/api/orderApi";
import {
  useCalculateCouponDiscountMutation,
  useGetShippingCostQuery,
} from "@/redux/api/shippingApi";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { CheckoutForm } from "./CheckoutForm";
import LoadingOverlay from "./LoadingOverlay";

interface OrderItem {
  id: string;
  name: string;
  model: string;
  price: number;
  quantity: number;
  image: string;
}

interface CouponResponse {
  success: boolean;
  message: string;
  result: {
    subtotal: number;
    discount: number;
    afterDiscountAmount: number;
    shippingCost: number;
    total: number;
  };
}

export default function Checkout() {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponData, setCouponData] = useState<CouponResponse["result"] | null>(
    null,
  );
  const [couponError, setCouponError] = useState("");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  // coupon api
  const [applyCouponFn, { isLoading: isApplyingCoupon }] =
    useCalculateCouponDiscountMutation();

  // cash on delivery api
  const [orderCashOnDeliveryFn, { isLoading: isPlacingCashOrder }] =
    useOrderCashOnDeliveryMutation();

  // online stripe payment
  const [onlineOrderPaymentFn, { isLoading: isPlacingOnlineOrder }] =
    useOrderOnlinePaymentMutation();

  // get shiping cost

  const {
    data: getShippingCost,
    isLoading: isShippingLoading,
    isError: isShippingError,
  } = useGetShippingCostQuery({});

  const shippingCharge = getShippingCost?.result?.[0]?.cost || 0;

  console.log("shipping charge", shippingCharge)

  // cart items selected
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Filter only selected items
  const selectedCartItems = cartItems.filter(
    (item: any) => item.selected === true,
  );

  // Calculate subtotal
  const subtotal = selectedCartItems.reduce((total: number, item: any) => {
    return total + item.price * item.quantity;
  }, 0);

  // Fixed shipping cost
  const shippingCost = shippingCharge;

  // Calculate total based on coupon data or regular calculation
  const total = couponData
    ? couponData.total
    : subtotal + shippingCost - discount;

  // Reset coupon data when cart items change
  useEffect(() => {
    if (selectedCartItems.length === 0) {
      setCouponData(null);
      setDiscount(0);
      setCouponError("");
    }
  }, [selectedCartItems.length]);

  const handleFormSubmit = async (data: any) => {
    console.log("Order submitted:", data);

    if (data.shippingMethod === "cash") {
      await handleCashOnDelivery(data);
    } else if (data.shippingMethod === "card" && data.paymentIntent) {
      await handleOnlinePayment(data);
    }
  };

  const handleCashOnDelivery = async (formData: any) => {
    if (selectedCartItems.length === 0) {
      toast.error("Please select items to place order");
      return;
    }

    if (!formData.shippingAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    try {
      // Prepare products array in required format
      const products = selectedCartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // Prepare order data
      const orderData = {
        products,
        shippingAddressId: formData.shippingAddressId,
        ...(couponCode && couponData && { couponCode: couponCode.trim() }),
      };

      console.log("Placing cash on delivery order:", orderData);

      // Call the cash on delivery API
      const response = await orderCashOnDeliveryFn(orderData).unwrap();

      if (response.success) {
        toast.success("The order has been created successfully");
        console.log("Cash on delivery order successful:", response);

        // Clear only the selected items from cart
        dispatch(clearSelectedItems());
        router.push("/order-success");
      }
    } catch (error: any) {
      console.error("Cash on delivery order failed:", error);
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  const handleOnlinePayment = async (formData: any) => {
    if (selectedCartItems.length === 0) {
      toast.error("Please select items to place order");
      return;
    }

    if (!formData.shippingAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!formData.paymentIntent || !formData.paymentIntent.id) {
      toast.error("Payment information is missing");
      return;
    }

    try {
      setIsProcessingOrder(true);
      // Prepare products array in required format
      const products = selectedCartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // Prepare order data with payment method ID
      const orderData = {
        products,
        shippingAddressId: formData.shippingAddressId,
        paymentMethodId: formData.paymentIntent.id, // Use payment intent ID as payment method ID
        ...(couponCode && couponData && { couponCode: couponCode.trim() }),
      };

      console.log("Placing online payment order:", orderData);

      // Call the online payment API
      const response = await onlineOrderPaymentFn(orderData).unwrap();

      if (response.success) {
        toast.success("The order has been created successfully");
        console.log("Online payment order successful:", response);

        // Clear only the selected items from cart
        dispatch(clearSelectedItems());
        router.push("/payment-success");
      }
    } catch (error: any) {
      console.error("Online payment order failed:", error);
      toast.error(error?.data?.message || "Failed to place order");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (selectedCartItems.length === 0) {
      setCouponError("Please select items to apply coupon");
      return;
    }

    try {
      setCouponError("");

      // Prepare products array in required format
      const products = selectedCartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const couponData = {
        products,
        couponCode: couponCode.trim(),
      };

      console.log("Sending coupon data:", couponData);

      // Call the API
      const response = await applyCouponFn(couponData).unwrap();

      if (response.success) {
        setCouponData(response.result);
        setDiscount(response.result.discount);
        console.log("Coupon applied successfully:", response);
        toast.success("Coupon applied successfully!");
      }
    } catch (error: any) {
      console.error("Coupon application failed:", error);
      setCouponError(error?.data?.message || "Failed to apply coupon");
      setCouponData(null);
      setDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponData(null);
    setDiscount(0);
    setCouponError("");
  };

  const isLoading =
    isPlacingCashOrder || isPlacingOnlineOrder || isApplyingCoupon;

  return (
    <div className="pt-48 lg:pt-60 pb-20">
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className=" p-6 lg:col-span-2">
            <CheckoutForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {selectedCartItems?.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${item.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="mb-6">
              <div className="flex items-stretch rounded-[12px] overflow-hidden border-[#E2E8F0] border-2 mb-2">
                {/* Input Field */}
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 placeholder-gray-400 outline-none text-base disabled:opacity-50"
                />
                {/* Apply Button */}
                <button
                  onClick={handleApplyCoupon}
                  disabled={isLoading || !couponCode.trim()}
                  className="bg-primary rounded-[12px] text-white font-medium px-8 py-3 transition-colors duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>

              {/* Coupon Error Message */}
              {couponError && (
                <div className="text-red-500 text-sm mt-2 flex justify-between items-center">
                  <span>{couponError}</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 text-xs underline"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Coupon Success Message */}
              {couponData && (
                <div className="text-green-600 text-sm mt-2 flex justify-between items-center">
                  <span>
                    Coupon applied successfully! Discount: $
                    {couponData.discount.toFixed(2)}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-800 text-xs underline"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Order Totals */}
            <div className="pt-5">
              <div className="flex justify-between items-center border-b border-dashed border-primary pb-5">
                <span className="text-gray-600">SUBTOTAL</span>
                <span className="font-semibold">
                  $
                  {couponData
                    ? couponData.subtotal.toFixed(2)
                    : subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-dashed border-primary py-5">
                <span className="text-gray-600">SHIPPING</span>
                <span className="font-semibold">
                  $
                  {couponData
                    ? couponData.shippingCost.toFixed(2)
                    : shippingCost.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-dashed border-primary py-5">
                <span className="text-gray-600">DISCOUNT</span>
                <span className="font-semibold text-green-600">
                  -$
                  {couponData
                    ? couponData.discount.toFixed(2)
                    : discount.toFixed(2)}
                </span>
              </div>

              {couponData && (
                <div className="flex justify-between items-center border-b border-dashed border-primary py-5">
                  <span className="text-gray-600">AFTER DISCOUNT</span>
                  <span className="font-semibold">
                    ${couponData.afterDiscountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-lg pt-5">
                <span className="font-semibold text-gray-900">TOTAL</span>
                <span className="font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay
        isVisible={isProcessingOrder}
        message={
          isPlacingOnlineOrder
            ? "Processing your payment..."
            : isPlacingCashOrder
              ? "Placing your order..."
              : "Processing your order..."
        }
      />
    </div>
  );
}

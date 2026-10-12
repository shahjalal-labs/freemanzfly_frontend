"use client";

import { Button } from "@/components/ui/button";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  toggleItemSelection,
} from "@/redux/allSlice/cartSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { CartItem } from "./CartItem";

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  // const cartTotal = useSelector((state: RootState) => state.cart.totalAmount);

  const handleQuantityChange = (
    id: string,
    changeType: "increase" | "decrease"
  ) => {
    if (changeType === "increase") {
      const item = cartItems.find((item) => item.id === id);
      // Check if we can increase quantity (not exceeding maxQuantity)
      if (item?.maxQuantity && item.quantity >= item.maxQuantity) {
        toast.error(`Maximum ${item.maxQuantity} items available!`);
        return;
      }
      dispatch(increaseQuantity(id));
    } else {
      dispatch(decreaseQuantity(id));
    }
  };

  const handleSelectionChange = (id: string) => {
    dispatch(toggleItemSelection(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared successfully");
  };

  const selectedItems = cartItems.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 0;
  const total = subtotal - discount;

  if (cartItems.length === 0) {
    return (
      <div className="pb-20 pt-52 lg:pt-60">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Start shopping to add items to your cart
            </p>
            <Button
              onClick={() => router.push("/product")}
              className="bg-primary text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-52 lg:pt-60">
      <div className="container mx-auto px-4 ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Shopping Cart ({cartItems.length} items)
          </h1>
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-[#F8FDDA] px-6 py-6">
                <div className="grid grid-cols-12 gap-4 text-[18px] font-medium text-default">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="px-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                    selected={item.selected || false}
                    maxQuantity={item.maxQuantity}
                    onQuantityChange={handleQuantityChange}
                    onSelectionChange={handleSelectionChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cart Total */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="bg-[#F8FDDA] p-6 rounded-tl-2xl rounded-tr-2xl">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cart Total
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-6 py-7">
                  <span className="text-gray-600">SUBTOTAL</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center px-6 pb-7">
                  <span className="text-gray-600">DISCOUNT</span>
                  <span className="font-semibold">
                    {discount > 0 ? `-$${discount}` : "----"}
                  </span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center text-lg px-6 py-7">
                  <span className="font-semibold text-gray-900">TOTAL</span>
                  <span className="font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white py-8 text-base font-medium rounded-none rounded-bl-2xl rounded-br-2xl"
                  onClick={() => router.push("/checkout")}
                  disabled={selectedItems.length === 0}
                  size={"lg"}
                >
                  Proceed To Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

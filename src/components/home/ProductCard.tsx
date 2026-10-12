import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addToCart } from "@/redux/allSlice/cartSlice";
import { RootState } from "@/redux/store";
import { Star } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  shortDescription: string;
  images: StaticImageData[];
  quantity: number; // Available stock quantity
  availability?: "InStock" | "PreOrder" | "OutOfStock";
}

export function ProductCard({
  id,
  name,
  price,
  rating,
  shortDescription,
  images,
  quantity: availableQuantity,
  availability,
}: ProductCardProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const normalizedAvailability =
    availability === "OutOfStock" || availability === "PreOrder"
      ? availability
      : "InStock";
  const isOutOfStock =
    normalizedAvailability === "OutOfStock" || availableQuantity <= 0;
  const isPreOrder = normalizedAvailability === "PreOrder";

  // Check if product is already in cart and get cart quantity
  const existingCartItem = cartItems.find((item) => item.id === id);
  const cartQuantity = existingCartItem ? existingCartItem.quantity : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error(`${name} is currently out of stock.`);
      return;
    }

    // Check if product is already in cart
    if (existingCartItem) {
      // Check if adding more would exceed available quantity
      if (existingCartItem.quantity >= availableQuantity) {
        toast.error(
          `Only ${availableQuantity} items available! Cannot add more.`,
        );
        return;
      }

      // Increase quantity of existing product
      dispatch(
        addToCart({
          id,
          name,
          price,
          image:
            images && images.length > 0
              ? typeof images[0] === "string"
                ? images[0]
                : (images[0] as StaticImageData).src
              : "/placeholder.png",
          maxQuantity: availableQuantity,
        }),
      );
      toast.info(`${name} quantity increased to ${cartQuantity + 1}`);
    } else {
      // Add new product to cart
      dispatch(
        addToCart({
          id,
          name,
          price,
          image:
            images && images.length > 0
              ? typeof images[0] === "string"
                ? images[0]
                : (images[0] as StaticImageData).src
              : "/placeholder.png",
          maxQuantity: availableQuantity,
        }),
      );
      toast.success(`${name} added to cart!`);
    }
  };

  // Check if cart quantity reached maximum available quantity
  const isMaxQuantityReached =
    !isOutOfStock && cartQuantity >= availableQuantity;

  return (
    <Card className="group overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 p-4 rounded-[24px]">
      <CardContent className="p-0">
        {/* Product Image and Info wrapped in Link */}
        <Link href={`/product-details?id=${id}`} className="block">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-[16px]">
            <Image
              src={
                images && images?.length > 0 ? images[0] : "/placeholder.png"
              }
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="pt-4 space-y-3">
            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">({rating})</span>
            </div>

            {/* Name and Price */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-default text-lg">{name}</h3>
              <span className="font-bold text-xl text-default">${price}</span>
            </div>

            <div className="flex items-center justify-between">
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
            </div>

            {/* Description */}
            <p className="text-sm text-[#94A3B8] leading-relaxed pb-6 truncate">
              {shortDescription}
            </p>
          </div>
        </Link>

        {/* Add to Cart Button - Always visible */}
        <Button
          onClick={handleAddToCart}
          variant="outline"
          size={"lg"}
          disabled={isOutOfStock || isMaxQuantityReached}
          className={`w-full border-primary text-primary rounded-[40px] py-6 hover:bg-primary hover:text-white transition-colors duration-200 bg-transparent ${
            isOutOfStock || isMaxQuantityReached
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isOutOfStock ? (
            <span>Out Of Stock</span>
          ) : existingCartItem ? (
            isMaxQuantityReached ? (
              <span>Max Quantity Added</span>
            ) : isPreOrder ? (
              <span>Add More Pre-order</span>
            ) : (
              <span>Add More Quantity</span>
            )
          ) : isPreOrder ? (
            <span>Pre-order Now</span>
          ) : (
            "Add to cart"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

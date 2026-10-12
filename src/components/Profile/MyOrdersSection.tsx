/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from "@/redux/api/orderApi";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Pagination from "../ui/pagination";
import Feedback from "./Feedback";

// Define types for the API response
interface Product {
  id: string;
  name: string;
  price: number;
  availability: string;
  images: string[];
}

interface OrderProduct {
  id: string;
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  orderId: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  products: OrderProduct[];
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface OrdersResponse {
  result: {
    result: Order[];
    meta: PaginationMeta;
  };
}

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderId: string, reason: string) => void;
  orderId?: string;
}

const CancelOrderModal = ({
  isOpen,
  onClose,
  orderId,
}: CancelOrderModalProps) => {
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelOrderFn, { isLoading }] = useCancelOrderMutation();

  const handleConfirm = async () => {
    try {
      if (cancellationReason.trim() && orderId) {
        const response = await cancelOrderFn({
          orderId,
          cancelReason: cancellationReason,
        }).unwrap();
        if (response.success) {
          toast.success("Order cancelled successfully.");
          setCancellationReason("");
          onClose();
        }
      }
    } catch (error) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as any).data?.message === "string"
          ? (error as any).data.message
          : String(error);

      console.log("error", errorMessage);
      toast.error(errorMessage || "Failed to cancel order.");
    }
  };

  const handleClose = () => {
    setCancellationReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="bg-orange-400 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-semibold">Cancel order</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600 text-base">
            Are you sure you want to cancel order?
          </p>

          <div className="space-y-3">
            <label className="block text-gray-900 font-medium">
              Please Choose Cancellation Reason :
            </label>
            <input
              type="text"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please enter cancellation reason..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-orange-400 text-orange-400 rounded-full font-medium hover:bg-orange-50 transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={handleConfirm}
              disabled={!cancellationReason.trim() || !orderId}
              className="flex-1 px-6 py-3 bg-orange-400 text-white rounded-full font-medium hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={25} />
                  Cancelling
                </div>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function MyOrdersSection() {
  // Move ALL hooks to the top, before any conditional logic
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: myOrdersData, refetch } = useGetMyOrdersQuery({
    page: currentPage,
    limit: 10,
  });

  const [cancelOrderFn, { isLoading: isCancelling }] = useCancelOrderMutation();

  // Extract data from API response with proper typing
  const orders: Order[] =
    (myOrdersData as OrdersResponse)?.result?.result || [];
  const paginationMeta: PaginationMeta = (myOrdersData as OrdersResponse)
    ?.result?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOpenCancelModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
    setIsModalOpen(false);
  };

  const handleConfirmCancel = async (orderId: string, reason: string) => {
    try {
      console.log("Cancelling order:", orderId, "with reason:", reason);

      // Call the cancel order mutation
      const result = await cancelOrderFn({
        orderId: orderId,
        cancelReason: reason,
      }).unwrap();

      console.log("Order cancelled successfully:", result);

      // Refetch orders to update the list
      refetch();

      // Close the modal
      handleCloseModal();

      // You can also show a success message here
    } catch (error) {
      console.error("Failed to cancel order:", error);
      // You can show an error message here
    }
  };

  // Now the conditional rendering can happen after all hooks
  if (!myOrdersData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600 flex items-center justify-center">
          <Loader2 className="animate-spin" size={25} /> Loading orders...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 bg-white border border-[#ADADAD40] shadow-sm rounded-[16px] p-8">
          <h1 className="text-2xl font-semibold text-primary">My Orders</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40] text-center py-12">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 bg-white border border-[#ADADAD40] shadow-sm rounded-[16px] p-8">
        <h1 className="text-2xl font-semibold text-primary">My Orders</h1>
      </div>

      <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
        {orders?.map((order: Order) => (
          <div key={order.id} className="">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order #{order.orderId}
                  </h2>
                  <p className="text-gray-600">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  <p className="text-gray-600">Total: ${order.totalAmount}</p>
                </div>
              </div>
              <div className="">
                <Button
                  onClick={() => handleOpenCancelModal(order.id)}
                  variant="outline"
                  className="text-default bg-[#EDEEF4] rounded-[99px] border-none"
                  disabled={
                    order.status.toLowerCase() === "cancelled" || isCancelling
                  }
                >
                  {isCancelling ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : null}
                  Cancel Order
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {order?.products?.map(
                (productItem: OrderProduct, index: number) => (
                  <div
                    key={productItem.id || index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl"
                  >
                    <Image
                      src={productItem.product.images[0] || "/placeholder.svg"}
                      alt={productItem.product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                      width={80}
                      height={80}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {productItem.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Availability: {productItem.product.availability}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Quantity: {productItem.quantity}
                      </p>
                      <p className="font-semibold text-gray-900">
                        ${productItem.product.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Only show if there are multiple pages */}
      {paginationMeta.totalPage > 1 && (
        <div className="mt-8">
          <Pagination
            totalPage={paginationMeta.totalPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      <CancelOrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        orderId={selectedOrderId || undefined}
      />

      <Feedback />
    </div>
  );
}

import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";

// Pagination Component
function Pagination({
  totalPage,
  currentPage,
  setCurrentPage,
}: {
  totalPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 text-sm font-medium border rounded-lg ${
              currentPage === page
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPage}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function OrderTrackingSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  const { data: myOrderData, isLoading } = useGetMyOrdersQuery({
    page: currentPage,
    limit: 10,
  });

  // Get the current order to display
  const orders = myOrderData?.result?.result || [];
  const paginationMeta = myOrderData?.result?.meta || {
    totalPage: 1,
    page: 1,
    limit: 10,
    total: 0,
  };

  const currentOrder = orders[currentOrderIndex];

  // Define the order status progression
  const statusOrder = [
    "Pending",
    "Processed",
    "Shipped",
    "InRoute",
    "Delivered",
    "Cancelled",
  ];

  // Map status to tracking steps
  const getTrackingSteps = (orderStatus: string) => {
    const currentStatusIndex = statusOrder.indexOf(orderStatus);

    return [
      {
        id: "processed",
        title: "Order Processed",
        icon: Package,
        completed: currentStatusIndex >= 1,
        active: orderStatus === "Processed",
      },
      {
        id: "shipped",
        title: "Order Shipped",
        icon: Truck,
        completed: currentStatusIndex >= 2,
        active: orderStatus === "Shipped",
      },
      {
        id: "in-route",
        title: "Order In Route",
        icon: Truck,
        completed: currentStatusIndex >= 3,
        active: orderStatus === "InRoute",
      },
      {
        id: "delivered",
        title: "Order Delivered",
        icon: MapPin,
        completed: currentStatusIndex >= 4,
        active: orderStatus === "Delivered",
      },
    ];
  };

  // Handle cancelled order separately
  const isCancelled = currentOrder?.status === "Cancelled";
  const trackingSteps = getTrackingSteps(currentOrder?.status || "Pending");

  // Reset order index when page changes or orders change

  useEffect(() => {
    setCurrentOrderIndex(0);
  }, [currentPage, orders]);

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#ADADAD40]">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Orders Tracking</h3>
          <p className="text-gray-600">Please wait while we fetch your order details...</p>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#ADADAD40] text-center">
        <p className="text-gray-600">No orders found</p>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

 

  return (
    <div>
      <div className="flex items-center justify-between mb-6 bg-white border border-[#ADADAD40] shadow-sm rounded-[16px] p-8">
        <h1 className="text-2xl font-semibold text-primary">Order Tracking</h1>

        {/* Order Selector - Only show if there are multiple orders */}
        {orders.length > 1 && (
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setCurrentOrderIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentOrderIndex === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Order
            </button>
            <span className="text-sm text-gray-600">
              Order {currentOrderIndex + 1} of {orders.length} (Page{" "}
              {currentPage})
            </span>
            <button
              onClick={() =>
                setCurrentOrderIndex((prev) =>
                  Math.min(orders.length - 1, prev + 1)
                )
              }
              disabled={currentOrderIndex === orders.length - 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Order
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#ADADAD40]">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order #{currentOrder.orderId}
          </h2>
          <p className="text-gray-600">
            Placed on {formatDate(currentOrder.createdAt)}
          </p>

          {/* Status Badge */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentOrder.status === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : currentOrder.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {currentOrder.status === "InRoute"
                ? "In Route"
                : currentOrder.status}
              {currentOrder.status === "Pending" && (
                <Clock className="w-4 h-4 ml-1" />
              )}
              {currentOrder.status === "Delivered" && (
                <CheckCircle className="w-4 h-4 ml-1" />
              )}
            </span>
          </div>

          {/* Cancellation Reason */}
          {isCancelled && currentOrder.cancelReason && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Cancellation Reason:</strong>{" "}
                {currentOrder.cancelReason}
              </p>
            </div>
          )}
        </div>

        {/* Cancelled Order Message */}
        {isCancelled ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Order Cancelled
            </h3>
            <p className="text-gray-600">
              This order was cancelled and is no longer active.
            </p>
          </div>
        ) : (
          /* Progress Bar - Only show for active orders */
          <div className="relative mb-12">
            <div className="flex items-center justify-between">
              {trackingSteps.map((step, index) => {
                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative"
                  >
                    {/* Connection Line */}
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`absolute top-5 left-6 w-full h-3 ${
                          step.completed ? "bg-primary" : "bg-primary/20"
                        }`}
                        style={{ width: "calc(100vw / 6)" }}
                      />
                    )}

                    {/* Step Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${
                        step.completed
                          ? "bg-primary text-white"
                          : step.active
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-current" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step Labels */}
            <div className="flex items-center justify-between mt-8">
              {trackingSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center text-center max-w-24"
                  >
                    <div className="mb-2">
                      <Icon
                        className={`w-8 h-8 ${
                          step.completed || step.active
                            ? "text-orange-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        step.completed || step.active
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.active && (
                      <span className="text-xs text-primary mt-1">Current</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Summary */}
        {/* <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            {currentOrder.products.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-xl font-bold text-primary">${currentOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div> */}
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
    </div>
  );
}

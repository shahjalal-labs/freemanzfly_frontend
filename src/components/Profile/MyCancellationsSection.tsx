import { useCancelMyOrdersQuery } from "@/redux/api/orderApi";
import Image from "next/image";
import { useState } from "react";
import Pagination from "../ui/pagination";

// Define TypeScript interfaces
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
  isPaid: boolean;
  cancelReason?: string;
  products: OrderProduct[];
}

interface PaginationMeta {
  totalPage: number;
  total: number;
}

interface OrdersResponse {
  result: {
    result: Order[];
    meta: PaginationMeta;
  };
}

export function MyCancellationsSection() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: myCancelOrdersData, isLoading } = useCancelMyOrdersQuery({
    page: currentPage,
    limit: 10,
    status: "Cancelled",
  });

  // Extract data from the API response with proper typing
  const orders: Order[] = (myCancelOrdersData as OrdersResponse)?.result?.result || [];
  const paginationMeta: PaginationMeta = (myCancelOrdersData as OrdersResponse)?.result?.meta || {
    totalPage: 1,
    total: 0,
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
        
        <div className="text-center py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading cancelled orders...</p>
        </div>
      </div>
    );
  }

  // If no data is available, show a message
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
       
        <div className="text-center py-8">
          <p className="text-gray-600">No cancelled orders found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#ADADAD40] mb-6">
        <h1 className="text-2xl font-semibold text-primary">Cancel Orders</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
        {orders?.map((order: Order) => (
          <div key={order.id} className="mb-8 last:mb-0">
            {/* Order Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Order #{order.orderId}
              </h2>
              <p className="text-gray-600">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {order.cancelReason && (
                <p className="text-sm text-gray-500 mt-1">
                  Reason: {order.cancelReason}
                </p>
              )}
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              {order?.products?.map((productItem: OrderProduct, index: number) => (
                <div
                  key={productItem.id || index}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl bg-[#FC961A1A]"
                >
                  <Image
                    src={productItem.product.images[0] || "/placeholder.svg"}
                    alt={productItem.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    width={80}
                    height={80}
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FC961A1A] text-[#FF4D4F]">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Total Amount:{" "}
                <span className="font-semibold">${order.totalAmount}</span>
              </div>
              <div className="text-sm text-gray-600">
                Payment Status:{" "}
                <span
                  className={
                    order.isPaid
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {order.isPaid ? "Paid" : "Not Paid"}
                </span>
              </div>
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
    </div>
  );
}
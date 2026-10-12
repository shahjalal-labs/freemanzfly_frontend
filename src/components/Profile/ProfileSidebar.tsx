"use client";

import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function ProfileSidebar({
  activeSection,
  onSectionChange,
}: ProfileSidebarProps) {
  const menuItems = [
    { id: "my-profile", label: "My Profile" },
    { id: "shipping-address", label: "Shipping Address" },
    { id: "order-tracking", label: "Order Tracking" },
    { id: "my-orders", label: "My Orders" },
    { id: "my-cancellations", label: "My Cancellations" },
    { id: "logout", label: "Logout" },
  ];

  const router = useRouter();

  const handleLogout = () => {
    // Remove accessToken from cookies
    Cookies.remove("accessToken");

    // Optional: Remove other related tokens if they exist
    // Cookies.remove("refreshToken")
    // localStorage.removeItem("storedUserEmail");
    // Redirect to login page or home page
    // window.location.href = "/login";
    router.push("/login");
  };

  const handleItemClick = (itemId: string) => {
    if (itemId === "logout") {
      handleLogout();
    } else {
      onSectionChange(itemId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#ADADAD40]">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Manage My Account
      </h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              activeSection === item.id
                ? "text-primary "
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

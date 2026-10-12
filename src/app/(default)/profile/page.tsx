"use client"

import { MyCancellationsSection } from "@/components/Profile/MyCancellationsSection"
import { MyOrdersSection } from "@/components/Profile/MyOrdersSection"
import { MyProfileSection } from "@/components/Profile/MyProfileSection"
import { OrderTrackingSection } from "@/components/Profile/OrderTrackingSection"
import { ProfileSidebar } from "@/components/Profile/ProfileSidebar"
import { ShippingAddressSection } from "@/components/Profile/ShippingAddressSection"
import { useState } from "react"


export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("my-profile")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "my-profile":
        return <MyProfileSection />
      case "shipping-address":
        return <ShippingAddressSection />
      case "order-tracking":
        return <OrderTrackingSection />
      case "my-orders":
        return <MyOrdersSection />
      case "my-cancellations":
        return <MyCancellationsSection />
      default:
        return <MyProfileSection />
    }
  }

  return (
    <div className="pt-52 pb-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <ProfileSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>
          <div className="flex-1">{renderActiveSection()}</div>
        </div>
      </div>
    </div>
  )
}

"use client"


import { OrderSuccess } from "@/components/Payment/OrderSuccess"
import { useRouter } from "next/navigation"

export default function OrderSuccessPage() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push("/")
  }

  const handleGoToProfile = () => {
    router.push("/profile")
  }

  return <OrderSuccess onGoHome={handleGoHome} onGoToProfile={handleGoToProfile} />
}

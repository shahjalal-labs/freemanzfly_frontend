import VerifyOTPPage from '@/components/auth/VerifyOtp'
import React from 'react'
import { Suspense } from 'react'

function page() {
  return (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyOTPPage/>
        </Suspense>
    </div>
  )
}

export default page
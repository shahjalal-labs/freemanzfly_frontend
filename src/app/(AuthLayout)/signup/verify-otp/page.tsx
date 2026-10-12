import SignupVerifyOtp from '@/components/auth/SignupVerifyOtp'
import React from 'react'
import { Suspense } from 'react'

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignupVerifyOtp />
      </Suspense>
    </div>
  )
}

export default page
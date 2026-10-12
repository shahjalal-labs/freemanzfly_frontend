import AboutUsBanner from '@/components/AboutUs/AboutUsBanner'
import { OurStorySection } from '@/components/AboutUs/OurStorySection'
import { ReadyForWork } from '@/components/AboutUs/ReadyForWork'
import { WhatWeSellSection } from '@/components/AboutUs/WhatWeSellSection'
import { WhatWeStandForSection } from '@/components/AboutUs/WhatWeStandForSection'
import Testimonial from '@/components/home/Testimonial'
import React from 'react'

function page() {
  return (
    <div>
        <AboutUsBanner/>
        <OurStorySection/>
        <WhatWeStandForSection/>
        <Testimonial/>
        <WhatWeSellSection/>
        <ReadyForWork/>
    </div>
  )
}

export default page
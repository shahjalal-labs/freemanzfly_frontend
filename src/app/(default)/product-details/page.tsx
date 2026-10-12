import { ProductDetail } from "@/components/ProductDetails/ProductDetail";

import { Suspense } from 'react';

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetail />
      </Suspense>
    </div>
  );
}

export default page;

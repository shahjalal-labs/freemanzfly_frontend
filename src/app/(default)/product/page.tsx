import { ProductListing } from "@/components/ProductCategories/ProductListing";

import { Suspense } from 'react';

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductListing />
      </Suspense>
    </div>
  );
}

export default page;

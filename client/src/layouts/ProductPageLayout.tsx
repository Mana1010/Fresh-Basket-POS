import React from "react";
import { Outlet } from "react-router-dom";
import ProductReports from "../pages/protected-pages/shared/components/product-page/ProductReports";

function ProductPageLayout() {
  return (
    <div className="w-full h-full">
      <div className="grid md:grid-cols-6 grid-cols-1 w-full lg:h-full gap-2">
        <div className="flex flex-col gap-2 col-span-5">
          <Outlet />
        </div>
        <ProductReports />
      </div>
    </div>
  );
}

export default ProductPageLayout;

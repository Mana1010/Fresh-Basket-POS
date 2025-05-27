import { Outlet } from "react-router-dom";
import ProductReports from "../pages/protected-pages/shared/components/product-page/ProductReports";

function ProductPageLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default ProductPageLayout;

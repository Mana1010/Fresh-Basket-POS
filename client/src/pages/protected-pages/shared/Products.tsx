import { lazy, Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ProductGraphLoading from "./components/loading/ProductGraphLoading";
import { useNavigate } from "react-router-dom";
import { MdOutlineManageSearch } from "react-icons/md";
import RecordBox from "../components/RecordBox";
import { PiMoneyLight } from "react-icons/pi";
import type { IconType } from "react-icons/lib";
import { AiOutlineProduct } from "react-icons/ai";
import { LuShapes } from "react-icons/lu";
const ProductList = lazy(() => import("./components/product-page/ProductList"));
const LazyTotalAmountProduct = lazy(
  () => import("./components/product-page/product-stats/TotalAmountProduct")
);
const LazyTotalProduct = lazy(
  () => import("./components/product-page/product-stats/TotalProducts")
);
const LazyTotalProductCategories = lazy(
  () => import("./components/product-page/product-stats/TotalProductCategories")
);

type ProductStatProps = {
  children: ReactNode;
  label: string;
  value: string;
  Icon: IconType;
  className?: string;
};
function ProductStat({ children, ...props }: ProductStatProps) {
  return (
    <Suspense fallback={<RecordBox {...props} isLoading={true} />}>
      <ErrorBoundary fallback={<RecordBox {...props} isLoading={true} />}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
}
function Products() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 w-full h-auto lg:h-full">
      <div className="grid gap-1.5 grid-cols-4 p-2 border border-zinc-200 rounded-sm">
        <ProductStat
          label="Total Number of Products"
          value="25"
          Icon={AiOutlineProduct}
        >
          <LazyTotalProduct />
        </ProductStat>
        <ProductStat
          label="Total Amount of Products"
          value="₱ 25.00"
          Icon={PiMoneyLight}
          className="col-span-2"
        >
          <LazyTotalAmountProduct />
        </ProductStat>
        <ProductStat label="Total Categories" value="5" Icon={LuShapes}>
          <LazyTotalProductCategories />
        </ProductStat>
      </div>
      <div className="w-full flex-grow gap-2 flex flex-col">
        <div className="flex space-x-1.5 items-center w-full">
          <div className="flex-grow rounded-sm bg-zinc-200 secondary/15 border border-zinc-400/35 flex items-center justify-center px-1 py-2">
            <button type="button" className="px-1 text-secondary">
              <MdOutlineManageSearch />
            </button>
            <input
              type="text"
              className="text-sm bg-transparent flex-grow text-secondary w-full outline-0 px-1"
              placeholder="Search Product (@e g Product Name or Sku)"
            />
          </div>
          <button
            onClick={() => navigate("add-product")}
            className="bg-primary text-white py-2 px-5 text-[0.8rem] rounded-sm cursor-pointer"
          >
            Add Product
          </button>
        </div>
        <Suspense fallback={<ProductGraphLoading />}>
          <ErrorBoundary fallback={<ProductGraphLoading />}>
            <ProductList />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
}

export default Products;

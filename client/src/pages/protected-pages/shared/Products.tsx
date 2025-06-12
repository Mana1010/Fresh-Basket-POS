import { lazy, Suspense, useState, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { MdOutlineManageSearch } from "react-icons/md";
import RecordBox from "../components/RecordBox";
import { PiMoneyLight } from "react-icons/pi";
import type { IconType } from "react-icons/lib";
import { AiOutlineProduct } from "react-icons/ai";
import { LuShapes } from "react-icons/lu";
import useSearchDebounce from "../../../hooks/useSearchDebounce";
import Title from "../../../components/Title";
import { IoCubeOutline } from "react-icons/io5";
import ProductList from "./components/product-page/ProductList";
import TableLoading from "./components/loading/TableLoading";
const LazyTotalAmountProduct = lazy(
  () => import("./components/product-page/product-stats/TotalAmountProduct")
);

const LazyTotalProductVariants = lazy(
  () => import("./components/product-page/product-stats/TotalProductVariants")
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
  const [searchProduct, setSearchProduct] = useState("");
  const [sortProduct, setSortProduct] = useState<"asc" | "desc" | "">("");
  const debouncedSearchedProduct = useSearchDebounce(searchProduct);
  return (
    <div className="flex flex-col gap-2 w-full h-auto lg:h-full">
      <Title title="Products" />
      <div className="grid gap-1.5 grid-cols-1 md:grid-cols-3  lg:grid-cols-4 p-2 border border-zinc-200 rounded-sm">
        <ProductStat
          label="Total Stock of Products"
          value=""
          Icon={IoCubeOutline}
        >
          <LazyTotalProduct />
        </ProductStat>
        <ProductStat
          label="Total Product Variants"
          value=""
          Icon={AiOutlineProduct}
        >
          <LazyTotalProductVariants />
        </ProductStat>
        <ProductStat
          label="Total Amount of Products"
          value=""
          Icon={PiMoneyLight}
        >
          <LazyTotalAmountProduct />
        </ProductStat>
        <ProductStat label="Total Categories" value="5" Icon={LuShapes}>
          <LazyTotalProductCategories />
        </ProductStat>
      </div>
      <div className="w-full flex-grow gap-2 flex flex-col overflow-x-auto">
        <div className="flex space-x-1.5 items-center w-full">
          <div className="flex-grow rounded-sm bg-zinc-100 secondary/15 border border-zinc-400/35 flex items-center justify-center px-1 py-2">
            <button type="button" className="px-1 text-secondary">
              <MdOutlineManageSearch />
            </button>
            <input
              onChange={(e) => setSearchProduct(e.target.value)}
              type="text"
              className="text-sm bg-transparent flex-grow text-secondary w-full outline-0 px-1"
              placeholder="Search products (e.g., Name, SKU, or Manufacturer)"
            />
          </div>
          <button
            onClick={() => navigate("add-product")}
            className="bg-primary text-white py-2 px-5 text-[0.8rem] rounded-sm cursor-pointer"
          >
            Add Product
          </button>
        </div>

        <ErrorBoundary fallback={<TableLoading />}>
          <ProductList
            debouncedSearchedProduct={debouncedSearchedProduct}
            sortProduct={sortProduct}
            setSortProduct={setSortProduct}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default Products;

import { lazy, Suspense, useState, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ProductGraphLoading from "./components/loading/ProductGraphLoading";
import { useNavigate } from "react-router-dom";
import { MdOutlineManageSearch } from "react-icons/md";
import RecordBox from "../components/RecordBox";
import type { IconType } from "react-icons/lib";
import { LuKey, LuShapes } from "react-icons/lu";
import useSearchDebounce from "../../../hooks/useSearchDebounce";
import Title from "../../../components/Title";
const LazyAccountList = lazy(
  () => import("./components/accounts-page/AccountList")
);
const LazyTotalAccounts = lazy(
  () => import("./components/accounts-page/accounts-stats/TotalAccounts")
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

function Accounts() {
  const navigate = useNavigate();
  const [searchAccount, setSearchAccount] = useState("");
  const debouncedSearchedAccount = useSearchDebounce(searchAccount);
  return (
    <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-2 w-full h-auto lg:h-full">
      <Title title="Products" />
      <div className="grid gap-1.5 grid-rows-1 md:grid-rows-3 lg:basis-[30%] basis-full p-2 border border-zinc-200 rounded-sm h-auto lg:h-full w-full">
        <ProductStat label="Total Accounts Created" value="" Icon={LuKey}>
          <LazyTotalAccounts />
        </ProductStat>
        <ProductStat
          label="Total Amount of Products"
          value="₱ 25.00"
          Icon={LuKey}
        >
          <LazyTotalAccounts />
        </ProductStat>
        <ProductStat label="Total Categories" value="5" Icon={LuShapes}>
          <LazyTotalProductCategories />
        </ProductStat>
      </div>
      <div className="w-full flex-grow gap-2 flex flex-col overflow-x-auto h-auto lg:h-full">
        <div className="flex space-x-1.5 items-center w-full">
          <div className="flex-grow rounded-sm bg-zinc-100 secondary/15 border border-zinc-400/35 flex items-center justify-center px-1 py-2">
            <button type="button" className="px-1 text-secondary">
              <MdOutlineManageSearch />
            </button>
            <input
              onChange={(e) => setSearchAccount(e.target.value)}
              type="text"
              className="text-sm bg-transparent flex-grow text-secondary w-full outline-0 px-1"
              placeholder="Search Accounts"
            />
          </div>
          <button
            onClick={() => navigate("add-account")}
            className="bg-primary text-white py-2 px-5 text-[0.8rem] rounded-sm cursor-pointer"
          >
            Add Account
          </button>
        </div>
        <Suspense fallback={<ProductGraphLoading />}>
          <ErrorBoundary fallback={<ProductGraphLoading />}>
            <LazyAccountList
              debouncedSearchedAccount={debouncedSearchedAccount}
            />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
}

export default Accounts;

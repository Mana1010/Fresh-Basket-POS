import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MdOutlineManageSearch } from "react-icons/md";
import useSearchDebounce from "../../../hooks/useSearchDebounce";
import Title from "../../../components/Title";
import TableLoading from "./components/loading/TableLoading";
import ReceiptList from "./components/receipts-page/ReceiptList";

function ReceiptHistory() {
  const [searchInventory, setSearchInventory] = useState("");
  const debounceSearchResult = useSearchDebounce(searchInventory);
  return (
    <div className="flex flex-col gap-2 w-full h-auto lg:h-full">
      <Title title="Receipts" />
      <div className="grid gap-1.5 grid-cols-4 p-2 border border-zinc-200 rounded-sm">
        {/* <ProductStat
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
        </ProductStat> */}
      </div>
      <div className="w-full flex-grow gap-2 flex flex-col">
        <div className="flex space-x-1.5 items-center w-full">
          <div className="flex-grow rounded-sm bg-zinc-100 secondary/15 border border-zinc-400/35 flex items-center justify-center px-1 py-2">
            <button type="button" className="px-1 text-secondary">
              <MdOutlineManageSearch />
            </button>
            <input
              onChange={(e) => setSearchInventory(e.target.value)}
              type="text"
              className="text-sm bg-transparent flex-grow text-secondary w-full outline-0 px-1"
              placeholder="Search receipt (e.g., Customer Name, Customer Email, Receipt Code, and Cashier)"
            />
          </div>
        </div>

        <ErrorBoundary fallback={<TableLoading />}>
          <ReceiptList debouncedSearchResult={debounceSearchResult} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default ReceiptHistory;

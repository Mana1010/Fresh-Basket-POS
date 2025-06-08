import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorBoundary } from "react-error-boundary";
import { MdOutlineManageSearch } from "react-icons/md";

import useSearchDebounce from "../../../hooks/useSearchDebounce";
import Title from "../../../components/Title";
import InventoryList from "./components/inventory-page/InventoryList";
import type { ReasonType } from "../../../types/inventory.types";
import TableLoading from "./components/loading/TableLoading";

function Inventory() {
  const navigate = useNavigate();
  const [searchInventory, setSearchInventory] = useState("");
  const debounceSearchResult = useSearchDebounce(searchInventory);
  const [reasonFilter, setReasonFilter] = useState<ReasonType | "">("");
  return (
    <div className="flex flex-col gap-2 w-full h-auto lg:h-full">
      <Title title="Inventory" />
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
              placeholder="Search Inventory"
            />
          </div>
          <button
            onClick={() => navigate("add-inventory")}
            className="bg-primary text-white py-2 px-5 text-[0.8rem] rounded-sm cursor-pointer"
          >
            Add Inventory
          </button>
        </div>

        <ErrorBoundary fallback={<TableLoading />}>
          <InventoryList
            debouncedSearchResult={debounceSearchResult}
            setReasonFilter={setReasonFilter}
            reasonFilter={reasonFilter}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default Inventory;

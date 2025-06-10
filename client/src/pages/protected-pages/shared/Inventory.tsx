import React, { lazy, Suspense, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorBoundary } from "react-error-boundary";
import { MdOutlineManageSearch } from "react-icons/md";

import useSearchDebounce from "../../../hooks/useSearchDebounce";
import Title from "../../../components/Title";
import InventoryList from "./components/inventory-page/InventoryList";
import type { ReasonType } from "../../../types/inventory.types";
import TableLoading from "./components/loading/TableLoading";
import RecordBox from "../components/RecordBox";
import type { IconType } from "react-icons/lib";
import {
  IoCaretDownOutline,
  IoCaretUpOutline,
  IoClipboardOutline,
} from "react-icons/io5";
const LazyTotalInventory = lazy(
  () => import("./components/inventory-page/inventory-stat/TotalInventory")
);

const LazyCumulativeStockOutQuantity = lazy(
  () =>
    import(
      "./components/inventory-page/inventory-stat/CumulativeStockOutQuantity"
    )
);
const LazyCumulativeStockInQuantity = lazy(
  () =>
    import(
      "./components/inventory-page/inventory-stat/CumulativeStockInQuantity"
    )
);
type InventoryStatProps = {
  children: ReactNode;
  label: string;
  value: string;
  Icon: IconType;
  className?: string;
};
function InventoryStat({ children, ...props }: InventoryStatProps) {
  return (
    <Suspense fallback={<RecordBox {...props} isLoading={true} />}>
      <ErrorBoundary fallback={<RecordBox {...props} isLoading={true} />}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
}
function Inventory() {
  const navigate = useNavigate();
  const [searchInventory, setSearchInventory] = useState("");
  const debounceSearchResult = useSearchDebounce(searchInventory);
  const [reasonFilter, setReasonFilter] = useState<ReasonType | "">("");
  return (
    <div className="flex flex-col gap-2 w-full h-auto lg:h-full">
      <Title title="Inventory" />
      <div className="grid gap-1.5 grid-cols-4 p-2 border border-zinc-200 rounded-sm">
        <InventoryStat
          label="Total Number of Inventories"
          value=""
          Icon={IoClipboardOutline}
        >
          <LazyTotalInventory />
        </InventoryStat>
        <InventoryStat
          label="Cumulative Stock-Out Quantity"
          value=""
          Icon={IoCaretDownOutline}
        >
          <LazyCumulativeStockOutQuantity />
        </InventoryStat>
        <InventoryStat
          label="Cumulative Stock-In Quantity"
          value=""
          Icon={IoCaretUpOutline}
        >
          <LazyCumulativeStockInQuantity />
        </InventoryStat>
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
              placeholder="Search inventory (e.g., Product Name and Product Sku)"
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

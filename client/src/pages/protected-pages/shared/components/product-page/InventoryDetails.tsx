import apple from "../../../../../assets/Frame 1.png";
import { useNavigate } from "react-router-dom";
import {
  IoCalendar,
  IoCaretDown,
  IoCaretUp,
  IoCash,
  IoClose,
  IoCog,
  IoCube,
  IoDocument,
  IoInformationCircle,
  IoTrendingDown,
  IoTrendingUp,
} from "react-icons/io5";

import { useModalStore } from "../../../../../store/modal.store";
import { dateFormat } from "../../../../../helper/dateFormat";
import { formatFinancialImpactNumber } from "../../../../../helper/formatFinancialImpactNumber";
import type { ReasonType } from "../../../../../types/inventory.types";
function InventoryDetails() {
  const { toggleInventoryDetails, inventoryDetails, closeInventoryDetails } =
    useModalStore();
  const navigate = useNavigate();
  return (
    <div
      onClick={closeInventoryDetails}
      className="bg-black/35 flex absolute inset-0 items-center justify-center z-[999] p-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/65 backdrop-blur-md w-full lg:w-[60%] flex flex-col md:flex-row gap-2 rounded-md custom-border h-full md:h-1/2  relative"
      >
        <button
          onClick={toggleInventoryDetails}
          className="bg-secondary text-white text-md p-1 rounded-full absolute -top-2 -right-2 "
        >
          <IoClose />
        </button>
        <div className="basis-1/2 relative h-full rounded-sm w-full border-r border-zinc-400/25 overflow-hidden bg-linear-to-r from-black/10 to-black/10">
          <img
            src={apple}
            alt="thumbnail"
            className="rounded-sm absolute object-center object-cover inset-0 -z-[1] h-full w-full"
          />
        </div>

        <div className="flex-grow flex flex-col p-2">
          <div className="pt-2 flex flex-col gap-2 flex-grow justify-between">
            <div className="flex w-full justify-between">
              <div className="flex flex-col space-y-2">
                <h1 className="text-secondary flex space-y-1.5 items-center self-start flex-col">
                  <span className="text-xl text-primary poppins-extrabold">
                    {inventoryDetails?.product_name}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoDocument />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {inventoryDetails?.sku}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoCube />
                  </span>
                  <h1 className="text-[0.7rem] text-secondary/75 flex items-center justify-center space-x-1">
                    <span
                      className={`${
                        Number(inventoryDetails?.stock) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      } text-md`}
                    >
                      {Number(inventoryDetails?.stock) > 0 ? (
                        <IoCaretUp />
                      ) : (
                        <IoCaretDown />
                      )}
                    </span>
                    <span>{inventoryDetails?.stock}</span>
                  </h1>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoCash />
                  </span>
                  <h1 className="text-[0.7rem] text-secondary/75 flex items-center justify-center space-x-1">
                    <span
                      className={`${
                        inventoryDetails?.reason === "customer_sale" &&
                        inventoryDetails?.type === "out"
                          ? "text-green-500"
                          : inventoryDetails?.reason === "supplier_delivery" &&
                            inventoryDetails?.type === "in"
                          ? "text-yellow-500"
                          : "text-red-500"
                      } text-xl`}
                    >
                      {inventoryDetails?.reason === "customer_sale" &&
                      inventoryDetails?.type === "out" ? (
                        <IoTrendingUp />
                      ) : (
                        <IoTrendingDown />
                      )}
                    </span>
                    <span>
                      {formatFinancialImpactNumber(
                        inventoryDetails?.financial_impact as string,
                        inventoryDetails?.reason as ReasonType
                      )}
                    </span>
                  </h1>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoInformationCircle />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {inventoryDetails?.reason === "supplier_delivery"
                      ? "Supplier Delivery"
                      : inventoryDetails?.reason === "damaged_or_spoiled"
                      ? "Damaged/Spoiled"
                      : "Sold in Customer"}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoCog />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {inventoryDetails?.manufacturer
                      ? inventoryDetails.manufacturer
                      : "N/A"}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoCalendar />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {dateFormat(new Date(inventoryDetails?.created_at as Date))}
                  </span>
                </h1>
              </div>
            </div>
            <div className="flex gap-1 justify-end items-end flex-col">
              <button
                onClick={() => {
                  navigate(`inventory/edit-inventory/${inventoryDetails?.id}`);
                  closeInventoryDetails();
                }}
                className="text-[0.7rem] bg-primary text-white custom-border rounded-md py-1.5 px-4 cursor-pointer"
              >
                Edit Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDetails;

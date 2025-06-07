import apple from "../../../../../assets/Frame 1.png";
import { useNavigate } from "react-router-dom";
import {
  IoBarcode,
  IoCalendar,
  IoClose,
  IoCog,
  IoCube,
  IoDocument,
  IoShapes,
} from "react-icons/io5";
import {
  formatToFormalNumber,
  formatToPhpMoney,
} from "../../../../../utils/format-to-money";
import { useModalStore } from "../../../../../store/modal.store";
import { dateFormat } from "../../../../../helper/dateFormat";
import { calculateTotalPrice } from "../../../../../utils/total-price";
function ProductDetails() {
  const { toggleProductDetails, productDetails, closeProductDetails } =
    useModalStore();
  const navigate = useNavigate();
  return (
    <div
      onClick={closeProductDetails}
      className="bg-black/35 flex absolute inset-0 items-center justify-center z-[999] p-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/65 backdrop-blur-md w-full lg:w-[60%] flex flex-col md:flex-row gap-2 rounded-md custom-border h-full md:h-1/2  relative"
      >
        <button
          onClick={toggleProductDetails}
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
                    {productDetails?.product_name}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoShapes />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {productDetails?.category.category_name}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoDocument />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {productDetails?.sku}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoBarcode />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {productDetails?.barcode}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoCog />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {productDetails?.manufacturer
                      ? productDetails.manufacturer
                      : "N/A"}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoCalendar />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {dateFormat(new Date(productDetails?.created_at as Date))}
                  </span>
                </h1>
              </div>
              <div className="flex flex-col space-y-0.5 justify-start items-end">
                <h5 className=" text-secondary/75 text-end text-sm">
                  <span className="text-[0.6rem]">Original Price: </span>
                  <span className="line-through">
                    {" "}
                    {formatToPhpMoney(String(productDetails?.price ?? 0))}
                  </span>
                </h5>
                {productDetails?.tax_rate === 0 ? (
                  <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                    <span className="text-[0.6rem]">No Tax Rate</span>
                  </h6>
                ) : (
                  <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                    <span className="text-[0.6rem]">Tax Rate: </span>
                    <span className="text-[0.8rem]">
                      {productDetails?.tax_rate}%
                    </span>
                  </h6>
                )}
                {productDetails?.discount_rate === 0 ? (
                  <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                    <span className="text-[0.6rem]">No Discount Rate</span>
                  </h6>
                ) : (
                  <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                    <span className="text-[0.6rem]">Discount Rate: </span>
                    <span className="text-[0.8rem]">
                      {productDetails?.discount_rate}%
                    </span>
                  </h6>
                )}
                <div className="h-[1.5px] w-[100px] bg-secondary/45" />
                <h6 className="flex space-x-1.5 text-secondary items-center">
                  <span className="text-[0.7rem]">Total Price: </span>
                  <span className="text-sm poppins-semibold">
                    {formatToPhpMoney(
                      String(
                        calculateTotalPrice({
                          orig_price:
                            productDetails?.price as unknown as string,
                          discount_rate:
                            productDetails?.discount_rate as number,
                          tax_rate: productDetails?.tax_rate as number,
                        })
                      )
                    )}
                  </span>
                </h6>
              </div>
            </div>
            <div className="flex gap-1 justify-end items-end flex-col">
              <h1 className="text-secondary poppins-semibold flex space-x-1 items-center">
                <span className="text-lg">
                  <IoCube />
                </span>
                {productDetails?.inventories_sum_stock === null ? (
                  <span className="text-[0.7rem]">Out of Stock</span>
                ) : (
                  <span className="text-[0.8rem] text-secondary/75">
                    {formatToFormalNumber(
                      productDetails?.inventories_sum_stock ?? "0"
                    )}
                  </span>
                )}
              </h1>
              <button
                onClick={() => {
                  navigate(`products/edit-product/${productDetails?.id}`);
                  closeProductDetails();
                }}
                className="text-[0.7rem] bg-primary text-white custom-border rounded-md py-1.5 px-4 cursor-pointer"
              >
                Edit Product
              </button>
              <button className="text-[0.7rem] bg-primary text-white custom-border rounded-md py-1.5 px-4 cursor-pointer">
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

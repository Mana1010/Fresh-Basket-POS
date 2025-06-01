import productThumbnail from "../../../../../assets/stickers/no-thumbnail.svg";
import apple from "../../../../../assets/Frame 1.png";
import { IoBarcode, IoCube, IoDocument } from "react-icons/io5";
import { formatToPhpMoney } from "../../../../../utils/format-to-money";
function ProductDetails() {
  return (
    <div className="bg-black/35 flex absolute inset-0 items-center justify-center z-[999] p-3">
      <div className="bg-white/65 backdrop-blur-md w-full lg:w-1/2 flex flex-col md:flex-row gap-2 rounded-md custom-border h-full md:h-1/2 overflow-hidden">
        <div className="basis-1/2 relative h-full rounded-sm w-full border-r border-zinc-400/25">
          <img
            src={apple}
            alt="thumbnail"
            className="rounded-sm absolute object-center object-cover inset-0"
          />
        </div>

        <div className="flex-grow flex flex-col p-2">
          <div className="pt-2 flex flex-col gap-2 flex-grow justify-between">
            <div className="flex w-full justify-between">
              <div className="flex flex-col space-y-1">
                <h1 className="text-secondary flex space-x-1.5 items-center self-start">
                  <span className="text-2xl text-primary poppins-extrabold">
                    Apple
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoDocument />
                  </span>
                  <span className="text-[0.8rem] text-secondary/75">
                    21-K242-21
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoBarcode />
                  </span>
                  <span className="text-[0.8rem] text-secondary/75">
                    23232323
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoBarcode />
                  </span>
                  <span className="text-[0.8rem] text-primary">2423242343</span>
                </h1>
              </div>
              <div className="flex flex-col space-y-0.5 justify-end items-end">
                <h5 className=" text-secondary/75 ">
                  <span className="text-[0.6rem]">Original Price: </span>
                  <span className="line-through">
                    {" "}
                    {formatToPhpMoney("12.53")}
                  </span>
                </h5>
                <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                  <span className="text-[0.6rem]">Tax Rate: </span>
                  <span className="text-[0.8rem]">5%</span>
                </h6>
                <h6 className="flex space-x-1.5 text-secondary/75 items-center">
                  <span className="text-[0.6rem]">Discount Rate: </span>
                  <span className="text-[0.8rem]">5%</span>
                </h6>
                <div className="h-[1.5px] w-[100px] bg-secondary/45" />
                <h6 className="flex space-x-1.5 text-secondary items-center">
                  <span className="text-[0.7rem]">Total Price: </span>
                  <span className="text-md poppins-semibold">
                    {formatToPhpMoney("223")}
                  </span>
                </h6>
              </div>
            </div>
            <div className="flex gap-1 justify-end items-end flex-col">
              <button className="text-[0.8rem] bg-primary text-white custom-border rounded-md py-2 px-4">
                Edit Product
              </button>
              <button className="text-[0.8rem] bg-primary text-white custom-border rounded-md py-2 px-4">
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

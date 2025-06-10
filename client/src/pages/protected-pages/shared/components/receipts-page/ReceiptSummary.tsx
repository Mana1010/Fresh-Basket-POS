import brandLogo from "../../../../../assets/brand-logo.png";
import { dateFormat } from "../../../../../helper/dateFormat";
import { formatToPhpMoney } from "../../../../../utils/format-to-money";
function ReceiptSummary() {
  return (
    <div className="bg-black/35 flex absolute inset-0 items-center justify-center z-[999] p-3">
      <div className="bg-zinc-100 h-full w-full lg:w-1/3 flex flex-col py-3 px-5 items-center">
        <div className="flex gap-1 items-center flex-col">
          <img src={brandLogo} alt="company-logo" width={70} height={70} />
          <h5 className="text-secondary text-[0.7rem]">
            Brgy, Proper, Cogon Roxas City, PH
          </h5>
          <h5 className="text-secondary text-[0.7rem]">09298309621</h5>
        </div>
        <div className="border-b-2 border-dotted w-full h-1 border-secondary my-2" />
        <div className="flex space-x-1.5 items-center text-secondary text-[0.7rem]">
          <span>Receipt ID:</span>
          <span className="text-[0.75rem] poppins-semibold">FB-2424246</span>
        </div>
        <div className="flex space-x-1.5 items-center text-secondary text-[0.7rem]">
          <span>Date:</span>
          <span className="text-[0.75rem] poppins-semibold">
            {dateFormat(new Date())}
          </span>
        </div>
        <div className="flex space-x-1.5 items-center text-secondary text-[0.7rem]">
          <span>Cashier:</span>
          <span className="text-[0.75rem] poppins-semibold">
            Tristan Vic T. Clarito
          </span>
        </div>
        <div className="border-b-2 border-dotted w-full h-1 border-secondary my-2" />
        <div className="flex space-x-1.5 items-center text-secondary text-[0.7rem]">
          <span>Customer Name:</span>
          <span className="text-[0.75rem] poppins-semibold">No Name</span>
        </div>
        <div className="flex space-x-1.5 items-center text-secondary text-[0.7rem]">
          <span>Customer Email:</span>
          <span className="text-[0.75rem] poppins-semibold">
            tristanvic@gmail.com
          </span>
        </div>
        <div className="border-b-2 border-dotted w-full h-1 border-secondary my-2" />
        <div className="w-full justify-center flex flex-grow h-1">
          <div className="flex overflow-y-auto flex-col">
            <table className="table-fixed w-full">
              <thead>
                <tr className="w-full ">
                  <td className="p-1.5 text-center text-[0.75rem] text-secondary poppins-semibold">
                    Name
                  </td>
                  <td className="p-1.5 text-center text-[0.75rem] text-secondary poppins-semibold">
                    Qty
                  </td>
                  {/* <td className="p-1.5 text-center text-[0.75rem] text-secondary">
                  Vat
                </td> */}
                  <td className="p-1.5 text-center text-[0.75rem] text-secondary poppins-semibold">
                    Price
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="w-full">
                  <td className="p-1.5 text-center text-[0.7rem] text-secondary">
                    Apple
                  </td>
                  <td className="p-1.5 text-center text-[0.7rem] text-secondary">
                    5
                  </td>
                  <td className="p-1.5 text-center text-[0.7rem] text-secondary">
                    {formatToPhpMoney("255")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="border-b-2 border-dotted w-full h-1 border-secondary my-2" />
        <div className="flex items-center w-full flex-col gap-1.5">
          <div className="flex items-center justify-between w-full">
            <span className="poppins-bold text-[0.7rem]">Subtotal</span>
            <span className="text-[0.75rem] poppins-semibold text-secondary">
              {formatToPhpMoney("2005")}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="poppins-bold text-[0.7rem]">Total Discount</span>
            <span className="text-[0.75rem] poppins-semibold text-secondary">
              {formatToPhpMoney("2005")}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="poppins-bold text-[0.7rem]">Total Tax</span>
            <span className="text-[0.75rem] poppins-semibold text-secondary">
              {formatToPhpMoney("2005")}
            </span>
          </div>
          <div className="border-b-2 border-dotted w-full h-1 border-secondary my-2" />
          <div className="flex items-center justify-between w-full">
            <span className="poppins-bold text-[0.7rem]">Total Amount Due</span>
            <span className="text-[0.75rem] poppins-semibold text-secondary">
              {formatToPhpMoney("2005")}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="poppins-bold text-[0.7rem]">Amount Paid</span>
            <span className="text-[0.75rem] poppins-semibold text-secondary">
              {formatToPhpMoney("2005")}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="poppins-bold text-[0.7rem]">Change</span>
            <span className="text-[0.75rem] poppins-semibold text-secondary">
              {formatToPhpMoney("2005")}
            </span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptSummary;

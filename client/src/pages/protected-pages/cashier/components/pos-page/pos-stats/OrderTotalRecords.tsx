import React from "react";
import RecordBox from "../../../../components/RecordBox";
import { formatToPhpMoney } from "../../../../../../utils/format-to-money";

function OrderTotalRecords() {
  return (
    <div className="flex-grow grid grid-cols-3 items-center justify-center gap-2 h-full">
      <RecordBox
        label="Subtotal"
        value={formatToPhpMoney("1000")}
        className="bg-transparent rounded-sm w-full truncate"
      />
      <RecordBox
        label="Total Discount"
        value={formatToPhpMoney("10323")}
        className="bg-transparentrounded-sm w-full truncate"
      />
      <RecordBox
        label="Total Tax"
        value={formatToPhpMoney("323")}
        textClassName="text-[0.9rem]"
        className="bg-transparent rounded-sm w-full truncate"
      />

      <RecordBox
        label="Grand Total"
        value={formatToPhpMoney("106223243223323")}
        textClassName="text-green-500"
        className="bg-transparent rounded-sm w-full truncate col-span-2"
      />

      <RecordBox
        label="Total Products"
        value="5"
        className="bg-transparent rounded-sm w-ful2"
      />
    </div>
  );
}

export default OrderTotalRecords;

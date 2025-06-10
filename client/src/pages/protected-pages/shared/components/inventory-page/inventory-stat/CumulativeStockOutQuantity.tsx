import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { INVENTORY_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoCaretDownOutline } from "react-icons/io5";

function CumulativeStockOutQuantity() {
  const axiosInstance = useAxiosInterceptor();
  const cumulativeStockOutQuantity = useSuspenseQuery({
    queryKey: ["inventory-stat", "cumulative_stock_out_quantity"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${INVENTORY_URL}/stats?type=cumulative_stock_out_quantity`
      );
      return response.data;
    },
    refetchInterval: 10000,
  });
  console.log(cumulativeStockOutQuantity.data);
  return (
    <RecordBox
      label="Cumulative Stock-Out Quantity"
      value={formatToFormalNumber(cumulativeStockOutQuantity.data?.stat)}
      Icon={IoCaretDownOutline}
    />
  );
}

export default CumulativeStockOutQuantity;

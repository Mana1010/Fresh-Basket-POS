import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { INVENTORY_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoCaretUpOutline } from "react-icons/io5";

function CumulativeStockInQuantity() {
  const axiosInstance = useAxiosInterceptor();
  const cumulativeStockInQuantity = useSuspenseQuery({
    queryKey: ["inventory-stat", "cumulative_stock_in_quantity"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${INVENTORY_URL}/stats?type=cumulative_stock_in_quantity`
      );
      return response.data;
    },
    refetchInterval: 10000,
  });
  return (
    <RecordBox
      label="Cumulative Stock-In Quantity"
      value={formatToFormalNumber(cumulativeStockInQuantity.data?.stat)}
      Icon={IoCaretUpOutline}
    />
  );
}

export default CumulativeStockInQuantity;

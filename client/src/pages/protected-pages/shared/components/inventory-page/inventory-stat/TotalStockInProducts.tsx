import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { INVENTORY_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoCaretDownOutline } from "react-icons/io5";
function TotalStockInProducts() {
  const axiosInstance = useAxiosInterceptor();
  const totalInventories = useSuspenseQuery({
    queryKey: ["inventory-stat", "total_inventories"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${INVENTORY_URL}/stats?type=total_inventories`
      );
      return response.data;
    },
    refetchInterval: 10000,
  });
  return (
    <RecordBox
      label="Total "
      value={formatToFormalNumber(totalInventories.data?.stat)}
      Icon={IoCaretDownOutline}
    />
  );
}

export default TotalStockInProducts;

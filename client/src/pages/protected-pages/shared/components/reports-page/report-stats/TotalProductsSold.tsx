import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { REPORT_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
function TotalProductSold() {
  const axiosInstance = useAxiosInterceptor();
  const totalProductSold = useSuspenseQuery({
    queryKey: ["report-stats", "total-product-sold"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${REPORT_URL}/total-product-sold`
      );
      return response.data;
    },
    refetchInterval: 1000 * 15,
  });
  return (
    <RecordBox
      label="Total Products Sold"
      value={formatToFormalNumber(totalProductSold.data?.stat ?? 0)}
    />
  );
}

export default TotalProductSold;

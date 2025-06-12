import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { REPORT_URL } from "../../../../../../api/request-api";
import { formatToPhpMoney } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoCashOutline } from "react-icons/io5";
function TotalSales() {
  const axiosInstance = useAxiosInterceptor();
  const totalSales = useSuspenseQuery({
    queryKey: ["report-stats", "total-sales"],
    queryFn: async () => {
      const response = await axiosInstance.get(`${REPORT_URL}/total-sales`);
      return response.data;
    },
    refetchInterval: 30000,
  });

  console.log(totalSales);
  return (
    <RecordBox
      label="Total Sales"
      value={formatToPhpMoney(totalSales.data?.stat ?? 0)}
      Icon={IoCashOutline}
    />
  );
}

export default TotalSales;

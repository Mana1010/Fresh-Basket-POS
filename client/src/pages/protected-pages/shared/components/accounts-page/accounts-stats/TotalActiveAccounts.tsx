import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { ACCOUNT_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoCheckmark } from "react-icons/io5";
function TotalActiveAccounts() {
  const axiosInstance = useAxiosInterceptor();
  const totalActiveAccounts = useSuspenseQuery({
    queryKey: ["account-stat", "total_active_accounts"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${ACCOUNT_URL}/stats?type=total_active_accounts`
      );
      return response.data;
    },
    staleTime: 5 * 10000,
  });
  console.log(totalActiveAccounts.data);
  return (
    <RecordBox
      label="Total Active Accounts"
      value={formatToFormalNumber(totalActiveAccounts.data?.stats)}
      Icon={IoCheckmark}
    />
  );
}

export default TotalActiveAccounts;

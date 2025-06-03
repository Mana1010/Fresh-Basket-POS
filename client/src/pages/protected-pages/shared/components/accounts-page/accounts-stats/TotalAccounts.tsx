import { PiMoneyLight } from "react-icons/pi";
import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { ACCOUNT_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoKey } from "react-icons/io5";
function TotalAccounts() {
  const axiosInstance = useAxiosInterceptor();
  const totalAccounts = useSuspenseQuery({
    queryKey: ["product-stat", "total_amount"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${ACCOUNT_URL}/stats?type=total_accounts`
      );
      return response.data;
    },
    staleTime: 5 * 10000,
  });

  console.log(totalAccounts.data);
  return (
    <RecordBox
      label="Total Accounts Created"
      value={formatToFormalNumber(totalAccounts.data?.stats)}
      Icon={IoKey}
    />
  );
}

export default TotalAccounts;

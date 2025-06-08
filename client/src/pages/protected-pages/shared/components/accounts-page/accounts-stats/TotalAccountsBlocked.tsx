import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { ACCOUNT_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoRemoveCircle } from "react-icons/io5";
function TotalAccountsBlocked() {
  const axiosInstance = useAxiosInterceptor();
  const totalAccountsBlocked = useSuspenseQuery({
    queryKey: ["account-stat", "total_accounts_blocked"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${ACCOUNT_URL}/stats?type=total_accounts_blocked`
      );
      return response.data;
    },
    staleTime: 5 * 10000,
  });
  console.log(totalAccountsBlocked.data);
  return (
    <RecordBox
      label="Total Accounts Blocked"
      value={formatToFormalNumber(totalAccountsBlocked.data?.stats)}
      Icon={IoRemoveCircle}
    />
  );
}

export default TotalAccountsBlocked;

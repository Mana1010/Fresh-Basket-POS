import { PiMoneyLight } from "react-icons/pi";
import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { PRODUCT_URL } from "../../../../../../api/request-api";
import { formatToPhpMoney } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
function TotalAmountProduct() {
  const axiosInstance = useAxiosInterceptor();
  const totalAmount = useSuspenseQuery({
    queryKey: ["product-stat", "total_amount"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${PRODUCT_URL}/stats?type=total_amount`
      );
      return response.data;
    },
  });
  return (
    <RecordBox
      label="Total Amount of Products"
      value={formatToPhpMoney(totalAmount.data?.stat)}
      Icon={PiMoneyLight}
      className="col-span-2"
    />
  );
}

export default TotalAmountProduct;

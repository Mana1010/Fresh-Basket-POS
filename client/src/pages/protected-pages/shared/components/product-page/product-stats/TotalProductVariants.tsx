import { PiMoneyLight } from "react-icons/pi";
import RecordBox from "../../../../components/RecordBox";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { PRODUCT_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AiOutlineProduct } from "react-icons/ai";
function TotalProductVariants() {
  const axiosInstance = useAxiosInterceptor();
  const totalAmount = useSuspenseQuery({
    queryKey: ["product-stat", "total_product_variants"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${PRODUCT_URL}/stats?type=total_product_variants`
      );
      return response.data;
    },
    refetchInterval: 10000,
  });
  return (
    <RecordBox
      label="Total Product Variants"
      value={formatToFormalNumber(totalAmount.data?.stat)}
      Icon={AiOutlineProduct}
    />
  );
}

export default TotalProductVariants;

import RecordBox from "../../../../components/RecordBox";

import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PRODUCT_URL } from "../../../../../../api/request-api";
import { formatToFormalNumber } from "../../../../../../utils/format-to-money";
import { IoCubeOutline } from "react-icons/io5";
function TotalProducts() {
  const axiosInstance = useAxiosInterceptor();
  const { data } = useSuspenseQuery({
    queryKey: ["product-stat", "total_products"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${PRODUCT_URL}/stats?type=total_products`
      );
      return response.data;
    },
    staleTime: 1000 * 30,
  });

  return (
    <RecordBox
      label="Total Stock of Products"
      value={formatToFormalNumber(data.stat)}
      Icon={IoCubeOutline}
    />
  );
}

export default TotalProducts;

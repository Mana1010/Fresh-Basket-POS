import { useSuspenseQuery } from "@tanstack/react-query";
import { PRODUCT_URL } from "../../../../../../api/request-api";
import useAxiosInterceptor from "../../../../../../hooks/useAxiosInterceptor";
import RecordBox from "../../../../components/RecordBox";
import { LuShapes } from "react-icons/lu";
function TotalProductCategories() {
  const axiosInstance = useAxiosInterceptor();
  const { data } = useSuspenseQuery({
    queryKey: ["product-stat", "total_categories"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${PRODUCT_URL}/stats?type=total_categories`
      );
      return response.data;
    },
    staleTime: Infinity,
  });

  return (
    <RecordBox
      label="Total Product Categories"
      value={data.stat}
      Icon={LuShapes}
    />
  );
}

export default TotalProductCategories;

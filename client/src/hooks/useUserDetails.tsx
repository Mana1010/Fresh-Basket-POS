import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { USER_URL } from "../api/request-api";
import type { BasicUserType } from "../types/user.types";
import type { AxiosError } from "axios";
import useAxiosInterceptor from "./useAxiosInterceptor";

function useUserDetails(type: "basic" | "full") {
  const axiosInterceptor = useAxiosInterceptor();
  const {
    data,
    isLoading,
  }: UseQueryResult<{ data: BasicUserType }, AxiosError> = useQuery({
    queryKey: ["user-information", type],
    queryFn: async () => {
      const response = await axiosInterceptor?.get(
        `${USER_URL}/user-information?type=${type}`
      );
      return response.data;
    },
  });
  return {
    user: data?.data,
    userLoading: isLoading,
  };
}

export default useUserDetails;

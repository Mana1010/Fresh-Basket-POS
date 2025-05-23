import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import useAxiosInterceptor from "./useAxiosInterceptor";
import { USER_URL } from "../api/request-api";
import type { BasicUserType } from "../types/user.types";
import type { AxiosError } from "axios";

function useUserDetails(type: "basic" | "full") {
  const axiosInterceptor = useAxiosInterceptor();
  const {
    data,
    isLoading,
    error,
  }: UseQueryResult<{ data: BasicUserType }, AxiosError> = useQuery({
    queryKey: ["user-information"],
    queryFn: async () => {
      const response = await axiosInterceptor.get(
        `${USER_URL}/user-information?type=${type}`
      );
      return response.data;
    },
  });
  console.log(data);
  return {
    user: data?.data,
    userLoading: isLoading,
  };
}

export default useUserDetails;

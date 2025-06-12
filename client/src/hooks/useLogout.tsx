import { useMutation } from "@tanstack/react-query";
import useAxiosInterceptor from "./useAxiosInterceptor";
import { AUTH_URL } from "../api/request-api";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
function useLogout() {
  const queryClient = useQueryClient();
  const axiosInterceptor = useAxiosInterceptor();
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const logout = useMutation({
    mutationFn: async () => {
      const response = await axiosInterceptor.post(`${AUTH_URL}/logout`);
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      localStorage.removeItem("session_token");
      setUser(null);
      navigate("/");
    },
    onError: ({ message }) => {
      queryClient.resetQueries({ queryKey: ["user-data"] });
      console.log(message);
      toast.success("Something went wrong, please try again");
    },
  });
  return { logout: logout.mutate, isLogoutLoading: logout.isPending };
}

export default useLogout;

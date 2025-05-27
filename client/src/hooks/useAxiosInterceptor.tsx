import axios, { isAxiosError } from "axios";
import { CLIENT_URL } from "../environment";
import getUser from "../utils/get-user";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth.store";
import { useEffect } from "react";
import type { UserType } from "../types/user.types";
import { useNavigate } from "react-router-dom";
const axiosInterceptor = axios.create({
  baseURL: CLIENT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
function useAxiosInterceptor() {
  const { setUser, user, clearUser } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const requestInterceptor = axiosInterceptor.interceptors.request.use(
      async (config) => {
        const session_token = localStorage.getItem("session_token");
        if (!session_token) {
          //Back to log in
          navigate("/");
          clearUser();
          return Promise.reject("No token available");
        }
        //Will get the user
        if (!user) {
          const user = await getUser();
          if (!user) {
            toast.error(
              "Something went wrong while fetching the user's details"
            );
          }
          setUser(user as UserType);
        }

        config.headers["Authorization"] = `Bearer ${session_token}`;
        return config;
      }
    );

    const responseInterceptor = axiosInterceptor.interceptors.response.use(
      (config) => {
        return config;
      },
      (err) => {
        if (isAxiosError(err) && err.response) {
          if (err.response?.status === 401) {
            navigate("/");
            clearUser();
            localStorage.removeItem("session_token");
            return;
          }
        }
        return Promise.reject("Something went wrong");
      }
    );

    return () => {
      axiosInterceptor.interceptors.request.eject(requestInterceptor);
      axiosInterceptor.interceptors.response.eject(responseInterceptor);
    };
  }, [clearUser, navigate, setUser, user]);
  return axiosInterceptor;
}

export default useAxiosInterceptor;

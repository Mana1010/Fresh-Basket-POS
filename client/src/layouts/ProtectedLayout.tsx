import { BREADCRUMB_NAVIGATION_LIST } from "../constant/breadcrumb-navigation-list";
import Header from "../pages/protected-pages/components/Header";
import Sidebar from "../pages/protected-pages/components/Sidebar";
import { Outlet } from "react-router-dom";
import useBreadCrumbs from "use-react-router-breadcrumbs";
import { useNavigate } from "react-router-dom";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import { AUTH_URL } from "../api/request-api";
import { useEffect } from "react";
import ProductDetails from "../pages/protected-pages/shared/components/product-page/ProductDetails";
import { useModalStore } from "../store/modal.store";
import AccountDetails from "../pages/protected-pages/shared/components/accounts-page/AccountDetails";
function ProtectedLayout() {
  const breadcrumbs = useBreadCrumbs(BREADCRUMB_NAVIGATION_LIST);
  const navigate = useNavigate();
  const { isOpenProductDetails, isOpenAccountDetails } = useModalStore();
  const token = localStorage.getItem("session_token");
  const checkAuth: UseQueryResult<
    { message: string },
    AxiosError<{ message: string }>
  > = useQuery({
    queryKey: ["check-auth"],
    queryFn: async () => {
      const response = await axios.get(`${AUTH_URL}/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
  useEffect(() => {
    if (checkAuth.isError) {
      const errStatus = checkAuth.error.response?.status;
      if (errStatus === 401) {
        localStorage.removeItem("session_token");
        navigate("/", { replace: true });
      } else {
        console.log(
          "An error occurred while checking authentication:",
          checkAuth.error.message
        );
      }
    }
  }, [checkAuth.isError, checkAuth.error, navigate]);

  return (
    <div className="flex items-center h-screen w-full bg-[#F5F5F5] p-2 relative">
      {isOpenProductDetails && <ProductDetails />}
      {isOpenAccountDetails && <AccountDetails />}
      <div className="flex-grow h-full flex flex-col gap-1">
        <Header />
        <div className="flex-grow flex w-full h-1">
          <Sidebar />
          <div className="h-full w-1 flex flex-col p-2 space-y-1 overflow-y-auto flex-grow">
            <div className="flex space-x-1.5">
              {breadcrumbs.map(({ match, breadcrumb }, i) => {
                return (
                  <div
                    key={match.pathname}
                    className="flex items-center justify-center space-x-1"
                  >
                    {i > 1 && <span>{">"}</span>}
                    <button
                      onClick={() => navigate(match.pathname)}
                      className={`text-primary hover:underline text-[0.7rem] ${
                        i === 0 && "hidden"
                      } ${
                        i === 1 &&
                        "flex space-x-1.5 items-center text-secondary text-[0.75rem]"
                      }`}
                    >
                      {i === 1 && match?.route?.icon && (
                        <img
                          src={match?.route?.icon as string}
                          alt="icon"
                          width={20}
                          height={20}
                        />
                      )}
                      <span>{breadcrumb}</span>
                    </button>{" "}
                  </div>
                );
              })}
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedLayout;

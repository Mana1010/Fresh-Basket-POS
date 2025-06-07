import { BREADCRUMB_NAVIGATION_LIST } from "../constant/breadcrumb-navigation-list";
import Header from "../pages/protected-pages/components/Header";
import Sidebar from "../pages/protected-pages/components/Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import useBreadCrumbs from "use-react-router-breadcrumbs";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AUTH_URL } from "../api/request-api";
import ProductDetails from "../pages/protected-pages/shared/components/product-page/ProductDetails";
import { useModalStore } from "../store/modal.store";
import AccountDetails from "../pages/protected-pages/shared/components/accounts-page/AccountDetails";
import useAxiosInterceptor from "../hooks/useAxiosInterceptor";
import InventoryDetails from "../pages/protected-pages/shared/components/product-page/InventoryDetails";
function ProtectedLayout() {
  const breadcrumbs = useBreadCrumbs(
    BREADCRUMB_NAVIGATION_LIST as Record<string, unknown>[]
  );
  const axiosInstance = useAxiosInterceptor();
  const navigate = useNavigate();
  const { isOpenProductDetails, isOpenAccountDetails, isOpenInventoryDetails } =
    useModalStore();
  const token = localStorage.getItem("session_token");

  useQuery({
    queryKey: ["check-auth"],
    queryFn: async () => {
      const response = await axiosInstance.get(`${AUTH_URL}/check-auth`);

      return response.data;
    },
    enabled: !!token,
  });

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex items-center h-screen w-full bg-[#F5F5F5] p-2 relative">
      {isOpenProductDetails && <ProductDetails />}
      {isOpenAccountDetails && <AccountDetails />}
      {isOpenInventoryDetails && <InventoryDetails />}
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
                        <span className="text-lg">
                          <match.route.icon />
                        </span>
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

import { BREADCRUMB_NAVIGATION_LIST } from "../constant/breadcrumb-navigation-list";
import Header from "../pages/protected-pages/components/Header";
import Sidebar from "../pages/protected-pages/components/Sidebar";
import { Outlet } from "react-router-dom";
import useBreadCrumbs from "use-react-router-breadcrumbs";
import { useNavigate } from "react-router-dom";
function ProtectedLayout() {
  const breadcrumbs = useBreadCrumbs(BREADCRUMB_NAVIGATION_LIST);
  const navigate = useNavigate();
  return (
    <div className="flex items-center h-screen w-full bg-[#F5F5F5] p-2">
      <div className="flex-grow h-full flex flex-col gap-1">
        <Header />
        <div className="flex-grow flex w-full h-1">
          <Sidebar />
          <div className="h-full w-full flex flex-col p-2 space-y-1 overflow-y-auto">
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

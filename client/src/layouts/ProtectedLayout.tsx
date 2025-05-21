import Header from "../pages/protected-pages/components/Header";
import Sidebar from "../pages/protected-pages/components/Sidebar";
import { Outlet } from "react-router-dom";
function ProtectedLayout() {
  return (
    <div className="flex items-center h-screen w-full bg-[#F5F5F5] p-2">
      <div className="flex-grow h-full flex flex-col gap-1">
        <Header />
        <div className="flex-grow flex w-full">
          <Sidebar />
          <div className="h-full w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedLayout;

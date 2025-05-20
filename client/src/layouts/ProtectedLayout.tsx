import Header from "../pages/protected-pages/components/Header";
import Sidebar from "../pages/protected-pages/components/Sidebar";
import { Outlet } from "react-router-dom";
import { useModalStore } from "../store/modal.store";
function ProtectedLayout() {
  const { isOpenSidebar } = useModalStore();
  return (
    <div className="flex items-center h-screen w-full bg-[#F1F1F1]">
      <div className="flex-grow h-full flex flex-col">
        <Header />
        <div className="flex-grow flex w-full">
          <Sidebar />
          <div className="h-full w-full bg-[#1E1F21]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedLayout;

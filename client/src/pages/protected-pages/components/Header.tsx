import { getTimeOfDay } from "../../../utils/get-time-day";
import HeaderClock from "./HeaderClock";
import morning from "../../../assets/header-sticker/morning.svg";
import afternoon from "../../../assets/header-sticker/afternoon.svg";
import evening from "../../../assets/header-sticker/evening.svg";
import { useAuthStore } from "../../../store/useAuthStore";
import { capitalizeFirstLetter } from "../../../utils/capitalize-first-letter";
import HeaderProfile from "./header/HeaderProfile";
function Header() {
  const { user } = useAuthStore();
  return (
    <div className="flex items-center justify-between w-full py-1.5 px-2.5 relative bg-white border border-gray-200 rounded-md ">
      <div className="flex items-center space-x-1.5">
        <img
          src={
            getTimeOfDay() === "Good Morning"
              ? morning
              : getTimeOfDay() === "Good Afternoon"
              ? afternoon
              : evening
          }
          width={30}
          height={30}
          alt="time"
        />
        <div className="flex poppins-semibold text-sm text-secondary space-x-1 flex-col">
          <h1 className="poppins-semibold">{getTimeOfDay()},</h1>{" "}
          <span className="text-primary">
            {capitalizeFirstLetter(user?.role as string)}
          </span>
        </div>
      </div>
      {/* <div className="flex items-center space-x-0.5">
        <span className="text-white text-lg">
          <PiMapPinSimpleLineFill />
        </span>
      </div> */}
      <div className="space-x-2 flex items-center">
        <HeaderClock />
        <HeaderProfile />
      </div>
    </div>
  );
}

export default Header;

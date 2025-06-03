import apple from "../../../../../assets/Frame 1.png";
import { useNavigate } from "react-router-dom";
import {
  IoCalendar,
  IoClose,
  IoKey,
  IoPersonCircle,
  IoPulse,
  IoSettings,
} from "react-icons/io5";
import { useModalStore } from "../../../../../store/modal.store";
import { dateFormat } from "../../../../../helper/dateFormat";
import { capitalizeFirstLetter } from "../../../../../utils/capitalize-first-letter";
import type { UserRole } from "../../../../../types/user.types";
function AccountDetails() {
  const { toggleAccountDetails, accountDetails, closeAccountDetails } =
    useModalStore();
  const navigate = useNavigate();
  return (
    <div
      onClick={closeAccountDetails}
      className="bg-black/35 flex absolute inset-0 items-center justify-center z-[999] p-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/65 backdrop-blur-md w-full lg:w-[60%] flex flex-col md:flex-row gap-2 rounded-md custom-border h-full md:h-1/2  relative"
      >
        <button
          onClick={toggleAccountDetails}
          className="bg-secondary text-white text-md p-1 rounded-full absolute -top-2 -right-2 "
        >
          <IoClose />
        </button>
        <div className="basis-1/2 relative h-full rounded-sm w-full border-r border-zinc-400/25 overflow-hidden bg-linear-to-r from-black/10 to-black/10">
          <img
            src={apple}
            alt="thumbnail"
            className="rounded-sm absolute object-center object-cover inset-0 -z-[1] h-full w-full"
          />
        </div>

        <div className="flex-grow flex flex-col p-2">
          <div className="pt-2 flex flex-col gap-2 flex-grow justify-between">
            <div className="flex w-full justify-between">
              <div className="flex flex-col space-y-2">
                <h1 className="text-secondary flex space-y-1.5 items-center self-start flex-col">
                  <span className="text-xl text-primary poppins-extrabold">
                    {accountDetails?.employer_name}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoPulse />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {capitalizeFirstLetter(accountDetails?.status as string)}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoSettings />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {capitalizeFirstLetter(accountDetails?.role as UserRole)}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoPersonCircle />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {accountDetails?.username}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoKey />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {accountDetails?.passcode}
                  </span>
                </h1>
                <h1 className="text-secondary poppins-semibold flex space-x-1.5 items-center">
                  <span className="text-lg">
                    <IoCalendar />
                  </span>
                  <span className="text-[0.7rem] text-secondary/75">
                    {dateFormat(new Date(accountDetails?.created_at as Date))}
                  </span>
                </h1>
              </div>
            </div>
            <div className="flex gap-1 justify-end items-end flex-col">
              <button
                onClick={() => {
                  navigate(`accounts/edit-account/${accountDetails?.id}`);
                  closeAccountDetails();
                }}
                className="text-[0.7rem] bg-primary text-white custom-border rounded-md py-1.5 px-4 cursor-pointer"
              >
                Edit Account
              </button>
              <button className="text-[0.7rem] bg-red-500 text-white custom-border rounded-md py-1.5 px-4 cursor-pointer">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;

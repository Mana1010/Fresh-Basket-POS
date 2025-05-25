import defaultUser from "../../../../assets/stickers/default-user.svg";
import useUserDetails from "../../../../hooks/useUserDetails";
import { capitalizeFirstLetter } from "../../../../utils/capitalize-first-letter";
import type { UserRole } from "../../../../types/user.types";
import HeaderProfileSkeleton from "./HeaderProfileSkeleton";
function HeaderProfile() {
  const { user, userLoading } = useUserDetails("basic");

  if (userLoading) {
    return <HeaderProfileSkeleton />;
  }
  return (
    <div className="flex items-center border-l-2 border-primary pl-2 min-w-[200px] space-x-1">
      <div className="size-8 rounded-full bg-white relative">
        <img
          src={user?.profile_picture ? user.profile_picture : defaultUser}
          className="absolute inset-0"
          alt="default-profile"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-secondary text-[0.8rem] poppins-semibold">
          {user?.employer_name}
        </h1>
        <small className="text-[0.65rem] poppins-semibold text-primary">
          {capitalizeFirstLetter(user?.role as UserRole)}
        </small>
      </div>
    </div>
  );
}

export default HeaderProfile;

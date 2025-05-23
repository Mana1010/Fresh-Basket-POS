export type UserRole = "cashier" | "manager" | "admin";
export type UserStatus = "active" | "inactive" | "blocked";
export type UserType = {
  id: string;
  role: UserRole;
  username: string;
};

export type FullUserType = {
  employer_name: string;
  status: UserStatus;
  passcode: string;
  profile_picture: string | null;
} & UserType;

export type BasicUserType = {
  profile_picture: string | null;
  employer_name: string;
} & Pick<UserType, "role">;

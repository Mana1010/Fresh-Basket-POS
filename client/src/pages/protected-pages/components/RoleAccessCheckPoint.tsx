import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { UserRole } from "../../../types/user.types";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AUTH_URL } from "../../../api/request-api";
import Spinner from "../../../components/Spinner";

type RoleAccessCheckPointProps = {
  allowedRoles: string[];
  navigateTo: string;
  children: ReactNode;
};

function RoleAccessCheckPoint({
  allowedRoles,
  navigateTo,
  children,
}: RoleAccessCheckPointProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const response = await axios.get(`${AUTH_URL}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("session_token")}`,
        },
      });
      return response.data.user;
    },
  });
  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center flex-col space-y-1.5">
        <Spinner className="size-12 border-2 border-t-transparent" />
        <span className="text-xl text-secondary"> Checking permissions...</span>
      </div>
    );
  }

  if (!data || !allowedRoles.includes(data?.role as UserRole)) {
    return <Navigate to={navigateTo} replace />;
  }
  return <>{children}</>;
}

export default RoleAccessCheckPoint;

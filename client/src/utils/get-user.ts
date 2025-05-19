import axios, { isAxiosError } from "axios";
import { AUTH_URL } from "../api/request-api";
import { type UserType } from "../types/user.types";

export default async function getUser(): Promise<UserType | undefined> {
  try {
    const response = await axios.get(`${AUTH_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("session_token")}`,
      },
    });
    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      throw err;
    }
    throw new Error("An unexpected error occurred while fetching user.");
  }
}

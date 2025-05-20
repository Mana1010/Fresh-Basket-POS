import axios from "axios";
type FetchDataProps = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  contentType?: "application/json" | "application/x-www-form-urlencoded";
  body?: Record<string, unknown>;
};
export async function fetchData({
  url,
  method,
  body,
  contentType,
}: FetchDataProps) {
  try {
    const response = await axios({
      url,
      method,
      headers: {
        "Content-Type": contentType || undefined,
        Authorization: `Bearer ${localStorage.getItem("session_token")}`,
      },
      data: body,
    });
    return response.data;
  } catch (err) {
    return err;
  }
}

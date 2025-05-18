export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const AUTH_URL = `${SERVER_URL}/api/auth`;

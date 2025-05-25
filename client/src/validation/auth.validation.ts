import { z } from "zod";
export const loginValidation = z.object({
  username: z
    .string()
    .min(1, "Username is required.")
    .max(20, "Username must be no longer than 20 characters.")
    .regex(/^[A-Z0-9]+$/i, "Username must not contain special characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must be no longer than 128 characters."),
});

export type LoginType = z.infer<typeof loginValidation>;

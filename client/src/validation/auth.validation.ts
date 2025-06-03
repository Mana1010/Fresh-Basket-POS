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

export const createAccountValidation = z.object({
  employer_name: z
    .string()
    .min(1, "Employee Name is required.")
    .max(255, "Employer Name must be no longer than 255 characters.")
    .regex(/^[A-Z0-9]+$/i, "Employer Name must not contain special characters"),
  role: z.enum(["admin", "manager", "cashier"], {
    message: "You need to select Admin, Manager, and Cashier only",
  }),
  username: z
    .string()
    .min(1, "Username is required.")
    .max(20, "Username must be no longer than 20 characters.")
    .regex(/^[A-Z0-9]+$/i, "Username must not contain special characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(72, "Password must not exceed 72 characters")
    .regex(
      /([!@#$%^&*()_+\-=\\[\]{};':"|,.<>/?]){2,}/,
      "Password must contain atleast 2 special characters"
    ),
  passcode: z
    .string()
    .min(1, "Passcode is required.")
    .max(6, "Username must be no longer than 6 characters."),
  profile_picture: z.string().nullable(),
});

export type LoginType = z.infer<typeof loginValidation>;

export type AccountType = z.infer<typeof createAccountValidation>;

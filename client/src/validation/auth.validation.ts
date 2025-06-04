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

export const accountValidation = z.object({
  employer_name: z
    .string()
    .min(1, "Employee Name is required.")
    .max(255, "Employer Name must be no longer than 255 characters.")
    .regex(
      /^[A-Z0-9\s.]+$/i,
      "Employer Name must not contain special characters"
    ),
  role: z.enum(["admin", "manager", "cashier"], {
    message: "You need to select Admin, Manager, and Cashier only",
  }),
  username: z
    .string()
    .min(1, "Username is required.")
    .min(5, "Username must be at least 5 characters long")
    .max(20, "Username must be no longer than 20 characters.")
    .regex(/^[A-Z0-9]+$/i, "Employer Name must not contain special characters")
    .regex(/^[A-Z0-9]+$/i, "Username must not contain special characters"),
  passcode: z
    .string()
    .min(1, "Passcode is required.")
    .length(6, "The passcode must be exactly 6 characters long."),
  profile_picture: z.string().nullable(),
});

export const createAccountValidation = z
  .intersection(
    accountValidation,
    z.object({
      password: z
        .string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters long")
        .max(72, "Password must not exceed 72 characters")
        .regex(
          /([!@#$%^&*()_+\-=\\[\]{};':"|,.<>/?]){2,}/,
          "Password must contain atleast 2 special characters"
        ),
      password_confirmation: z
        .string()
        .min(1, "Confirm Password is required.")
        .max(72, "Confirm Password must not exceed 72 characters"),
    })
  )
  .refine(
    (data) => {
      return data.password === data.password_confirmation;
    },
    {
      path: ["password_confirmation"],
      message: "Password does not match",
    }
  );
export const editAccountValidation = z
  .intersection(
    accountValidation,
    z.object({
      password: z.string().superRefine((password, ctx) => {
        if (password.length === 0) return;
        if (password.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 8 characters long",
          });
        }
        if (password.length > 72) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must not exceed 72 characters",
          });
        }
        if (!/([!@#$%^&*()_+\-=\\[\]{};':"|,.<>/?]){2,}/.test(password)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain atleast 2 special characters",
          });
        }
      }),

      password_confirmation: z.string().refine((password) => {
        return password.length <= 72;
      }, "Confirm Password must not exceed 72 characters"),
    })
  )
  .refine(
    (data) => {
      return data.password === data.password_confirmation;
    },
    {
      path: ["password_confirmation"],
      message: "Password does not match",
    }
  );
export type LoginType = z.infer<typeof loginValidation>;

export type AccountType = z.infer<typeof createAccountValidation>;

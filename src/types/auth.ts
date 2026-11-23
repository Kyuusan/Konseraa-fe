import { z } from "zod";

// Bodies of POST /auth/forgot-password and POST /auth/reset-password (in spec).
// The confirmation field is UI-only and is not sent.

export const ForgotPasswordSchema = z.object({
  email: z.email("Enter the email you signed up with."),
});
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1),
    /** minLength 8, as in POST /auth/register. */
    new_password: z.string().min(8, "Use at least 8 characters."),
    confirm_password: z.string(),
  })
  .refine((value) => value.confirm_password === value.new_password, {
    path: ["confirm_password"],
    message: "The passwords do not match.",
  });
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

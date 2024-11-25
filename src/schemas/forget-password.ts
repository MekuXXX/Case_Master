import * as z from "zod";

export const forgetPasswordShema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export type ForgetPasswordSchema = z.infer<typeof forgetPasswordShema>;

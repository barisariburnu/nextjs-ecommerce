import z from "zod";

export interface CustomJwtSessionClaims {
  metadata?: {
    role?: "admin" | "user";
  };
}

export const UserFormSchema = z.object({
  firstName: z
    .string({ message: "First name is Required!" })
    .min(2, { message: "First name must be at least 2 characters!" })
    .max(50),
  lastName: z
    .string({ message: "Last name is Required!" })
    .min(2, { message: "Last name must be at least 2 characters!" })
    .max(50),
  username: z
    .string({ message: "Username is Required!" })
    .min(2, { message: "Username must be at least 2 characters!" })
    .max(50),
  emailAddress: z.array(z.email({ message: "Invalid email address!" })),
  password: z
    .string({ message: "Password is Required!" })
    .min(8, { message: "Password must be at least 8 characters!" })
    .max(50),
});

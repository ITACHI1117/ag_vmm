import z4, { email, z } from "zod/v4";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  // role: z.enum(["IT", "admin", "staff"], {
  //   errorMap: () => ({ message: "Role must be either IT, admin, or staff" }),
  // }),
  roleKey: z.string().uuid("Role key must be a valid UUID"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

import { z } from "zod";

const PLATE_REGEX = /^[A-Z0-9\s-]{1,10}$/i; // alphanumeric, spaces or hyphens, up to 10 chars

const addVehicleSchema = z.object({
  plateNumber: z
    .string()
    .trim()
    .min(1, "Plate number is required")
    .regex(PLATE_REGEX, "Invalid plate number format"),

  make: z
    .string()
    .trim()
    .min(1, "Make is required")
    .max(100, "Make is too long"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .max(100, "Model is too long"),

  // Accepts number or string (e.g. "2020"), coerces to number, must be an integer between 1900 and next year
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Year must be a 4-digit number"),
});

export type Vehicle = z.infer<typeof addVehicleSchema>;
export { addVehicleSchema };

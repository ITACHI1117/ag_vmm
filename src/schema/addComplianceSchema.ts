import { z } from "zod";

export const addComplianceSchema = z.object({
  compliance_type: z.string().min(1, "Compliance type is required"), // must not be empty
  document_number: z.string().min(1, "Document number is required"), // must not be empty
  issue_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Issue date must be a valid date",
    })
    .optional(), // optional if some documents don't have issue date
  expiry_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Expiry date must be a valid date",
  }),
  status: z.enum(["active", "expiring_soon", "expired"]).optional(), // optional if server sets it automatically
});

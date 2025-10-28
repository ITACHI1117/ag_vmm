import { z } from "zod";

export const addExpenseSchema = z.object({
  //   vehicle_id: z.string().trim().min(1, "Vehicle ID is required"),

  expense_type: z.string().trim().min(1, "Expense type is required"),

  description: z.string().trim().min(1, "Description is required"),

  amount: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number"),

  vehicle_mileage: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Millage must be a valid number"),
});

export type AddExpense = z.infer<typeof addExpenseSchema>;

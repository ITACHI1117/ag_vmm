// Get Dashboard information
// through supabse Supabase RCP (Remote Procedure Cell)

import { supabase } from "@/supabse-client";
import { useQuery } from "@tanstack/react-query";

// Get total Vehicles
export const useGetTotalVehicles = () => {
  return useQuery({
    queryKey: ["get-total-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_total_vehicles");
      if (error) throw error;
      return data;
    },
  });
};

// Get total spent on vehicles for the current year
export const useGetTotalSpentCurrentYear = () => {
  return useQuery({
    queryKey: ["get-total-spent-current-year"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_current_year_expense_total"
      );
      if (error) throw error;
      return data;
    },
  });
};

// Get total expenses logged current year
export const useGetTotalExpensesLoggedCurrentYear = () => {
  return useQuery({
    queryKey: ["get-total-expenses-logged-current-year"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_total_expenses_logged_current_year"
      );
      if (error) throw error;
      return data;
    },
  });
};

// Get monthly expenses
export const useGetMonthlyExpenses = () => {
  return useQuery({
    queryKey: ["get-monthly-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_monthly_expenses_current_year"
      );
      if (error) throw error;
      return data;
    },
  });
};

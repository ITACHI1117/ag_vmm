// add expense

import { queryClient } from "@/config/queryclient";
import { supabase } from "@/supabse-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Add vehicles to the supabse table
export const useAddExpenses = () => {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const { data: res, error } = await supabase
        .from("expenses")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return res;
    },
    // ✅ On success, replace optimistic data with actual data
    onSuccess: (res) => {
      queryClient.setQueryData(["get-vehicle-expenses"], (old: any) => [
        ...(old?.filter((v: any) => !v.optimistic) || []),
        res,
      ]);
    },
  });
};

// Get all Expenses for a particular vehicle
export const useGetVehicleExpenses = (vehicle_id) => {
  return useQuery({
    queryKey: ["get-vehicle-expenses", vehicle_id],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select(
          `
          id,
          vehicle_id,
          expense_type,
          description,
          amount,
          vehicle_mileage,
          created_at,
          users ( full_name ),
          expenses_files (
            id,
      file_url,
      file_name
    )
        `
        )
        .eq("vehicle_id", vehicle_id)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

// for dashboard  get 5 recent expenses
export const useGetFewExpenses = () => {
  return useQuery({
    queryKey: ["get-few-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select(
          `
          id,
          amount,
          created_at,
          expense_type,
          vehicles (plate_number, id)
          `
        )
        .order("created_at", { ascending: true })
        .is("deleted_at", null)
        .limit(5);
      if (error) throw error;
      return data;
    },
  });
};

// upload expenses Files
export const useUploadExpensesFiles = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: res, error } = await supabase
        .from("expenses_files")
        .insert(data);
      if (error) throw error;
      return res;
    },
  });
};

// Delete expenses
export const useDeleteExpenses = () => {
  return useMutation({
    mutationFn: async (vehicle_id) => {
      console.log(vehicle_id);
      const { data, error } = await supabase
        .from("expenses")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", vehicle_id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      // wait a few milliseconds to ensure the database is updated
      await new Promise((resolve) => setTimeout(resolve, 300)); // wait 300ms
      // just refetch the compliance list for that vehicle
      await queryClient.refetchQueries({
        queryKey: ["get-vehicle-expenses", data.vehicle_id],
      });

      await queryClient.refetchQueries({
        queryKey: ["total-amount-spent-on-vehicle", data.vehicle_id],
      });
    },
    onError: (err) => toast.error(err.message),
  });
};

// Delete expenses files
export const useDeleteExpensesFiles = () => {
  return useMutation({
    mutationFn: async (expenses_id) => {
      const { data: res, error } = await supabase
        .from("expenses_files")
        .delete()
        .eq("expenses_id", expenses_id);
      if (error) throw error;
      return res;
    },
    onSuccess: () => toast.success("Expense Files deleted"),
    onError: (err) => toast.error(err.message),
  });
};

// Get all the expenses for history purposes
export const useGetAllVehiclesExpensesHistory = (search) => {
  return useQuery({
    queryKey: ["get-expenses-history", search],
    queryFn: async () => {
      if (!search || search == "") {
        const { data, error } = await supabase
          .from("expenses_view")
          .select(
            `
  id,
  expense_type,
  amount,
  vehicle_mileage,
  description,
  created_at,
  deleted_at,
  plate_number,
  files
`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        return data;
      } else {
        // Search functionality
        // This sql query search and returns plate number or make or model thats like the searchTerm
        const { data, error } = await supabase
          .from("expenses_view")
          .select(
            `
 id,
  expense_type,
  amount,
  vehicle_mileage,
  description,
  created_at,
  deleted_at,
  plate_number,
  files
`
          )
          .or(
            `plate_number.ilike.%${search}%,expense_type.ilike.%${search}%,description.ilike.%${search}%`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        return data;
      }
    },
  });
};

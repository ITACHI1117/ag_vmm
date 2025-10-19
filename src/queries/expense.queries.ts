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
      //   console.log(data);
      const { data: res, error } = await supabase
        .from("expenses")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return res;
    },
    // Optimistic update
    onMutate: async (newExpenses) => {
      console.log(newExpenses);

      const key = ["get-vehicle-expenses", newExpenses.vehicle_id];

      await queryClient.cancelQueries({ queryKey: key });

      const previousExpenses = queryClient.getQueryData(key);

      // Optimistically update cache
      queryClient.setQueryData(key, (old: any) => [
        ...(old || []),
        { ...newExpenses, id: Math.random().toString(), optimistic: true },
      ]);

      return { previousExpenses };
    },
    // ❌ Rollback if there's an error
    onError: (err, newExpenses, context) => {
      if (context?.previousExpenses) {
        queryClient.setQueryData(
          ["get-vehicle-expenses", newExpenses.vehicle_id],
          context.previousExpenses
        );
      }
      console.error("Error adding vehicle:", err.message);
    },

    // ✅ On success, replace optimistic data with actual data
    onSuccess: (res) => {
      queryClient.setQueryData(["get-vehicle-expenses"], (old: any) => [
        ...(old?.filter((v: any) => !v.optimistic) || []),
        res,
      ]);
      console.log("Vehicle expenses added successfully:", res);
    },

    // // 🔄 Refetch to ensure data is fully synced
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-vehicle-expenses"] });
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
      const { data, error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", vehicle_id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => toast.success("Expense deleted"),
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

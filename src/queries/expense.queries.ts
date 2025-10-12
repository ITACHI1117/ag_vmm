// add expense

import { supabase } from "@/supabse-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    // Optimistic update
    // onMutate: async (newVehicle) => {
    //   await queryClient.cancelQueries({ queryKey: ["get-all-vehicles"] });

    //   const previousVehicles = queryClient.getQueriesData(["get-all-vehicles"]);

    //   // Optimistically update cache
    //   queryClient.setQueryData(["get-all-vehicles"], (old: any) => [
    //     ...(old || []),
    //     { ...newVehicle, id: Math.random().toString(), optimistic: true },
    //   ]);
    //   return { previousVehicles };
    // },
    // ❌ Rollback if there's an error
    // onError: (err, newVehicle, context) => {
    //   if (context?.previousVehicles) {
    //     queryClient.setQueryData(
    //       ["get-all-vehicles"],
    //       context.previousVehicles
    //     );
    //   }
    //   console.error("Error adding vehicle:", err.message);
    // },

    // ✅ On success, replace optimistic data with actual data
    // onSuccess: (res) => {
    //   queryClient.setQueryData(["get-all-vehicles"], (old: any) => [
    //     ...(old?.filter((v: any) => !v.optimistic) || []),
    //     res,
    //   ]);
    //   console.log("Vehicle added successfully:", res);
    // },

    // // 🔄 Refetch to ensure data is fully synced
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
    // },
  });
};

// Get all Expenses for a particular vehicle
export const useGetVehicleExpenses = (search, vehicle_id) => {
  return useQuery({
    queryKey: ["get-vehicle-expenses", search, vehicle_id],
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
          invoice_url,
          created_at,
          users ( full_name )
        `
        )
        .eq("vehicle_id", vehicle_id)
        .order("created_at", { ascending: true });

      if (search && search.trim() !== "") {
        query = query.or(
          `(expense_type.ilike.%${search}%,description.ilike.%${search}%)`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

import { addVehicleSchema } from "@/schema/addVehicleSchema";
import { supabase } from "@/supabse-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

// Add vehicles to the supabse table
export const useAddVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof addVehicleSchema>) => {
      const { data: res, error } = await supabase
        .from("vehicles")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return res;
    },
    // Optimistic update
    onMutate: async (newVehicle) => {
      await queryClient.cancelQueries({ queryKey: ["get-all-vehicles"] });

      const previousVehicles = queryClient.getQueriesData(["get-all-vehicles"]);

      // Optimistically update cache
      queryClient.setQueryData(["get-all-vehicles"], (old: any) => [
        ...(old || []),
        { ...newVehicle, id: Math.random().toString(), optimistic: true },
      ]);
      return { previousVehicles };
    },
    // ❌ Rollback if there's an error
    onError: (err, newVehicle, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(
          ["get-all-vehicles"],
          context.previousVehicles
        );
      }
      console.error("Error adding vehicle:", err.message);
    },

    // ✅ On success, replace optimistic data with actual data
    onSuccess: (res) => {
      queryClient.setQueryData(["get-all-vehicles"], (old: any) => [
        ...(old?.filter((v: any) => !v.optimistic) || []),
        res,
      ]);
    },

    // 🔄 Refetch to ensure data is fully synced
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-vehicles"] });
    },
  });
};

// Get all vehicles
export const useGetAllVehicles = (search) => {
  return useQuery({
    queryKey: ["get-all-vehicles", search],
    queryFn: async () => {
      if (!search || search == "") {
        const { data, error } = await supabase
          .from("vehicles")
          .select(
            `
             id,
    plate_number,
    make,
    model,
    year,
    users ( full_name ),
    expenses (amount),
    created_at
            `
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        return data;
      } else {
        // Search functionality
        // This sql query search and returns plate number or make or model thats like the searchTerm
        const { data, error } = await supabase
          .from("vehicles")
          .select(
            ` 
             id,
    plate_number,
    make,
    model,
    year,
    users ( full_name ),
    created_at
            `
          )
          .or(
            `plate_number.ilike.%${search}%,make.ilike.%${search}%,model.ilike.%${search}%`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        return data;
      }
    },
  });
};

// Get Particular Vehicle
export const useGetVehicle = (vehicleId) => {
  return useQuery({
    queryKey: ["get-vehicle", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();
      if (error) throw error;
      return data;
    },
  });
};

// // Get Total Amount Spent on vehicle
// through supabse Supabase RCP (Remote Procedure Cell)
export const useGetTotalAmountSpentOnVehicle = (vehicle_id) => {
  return useQuery({
    queryKey: ["total-amount-spent-on-vehicle", vehicle_id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_total_expense_for_vehicle",
        { vehicle_id_input: vehicle_id }
      );
      if (error) throw error;
      return data;
    },
  });
};

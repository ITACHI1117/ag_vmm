import { supabase } from "@/supabse-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/config/queryclient";

// get active key
export const useGetActiveKey = () => {
  return useQuery({
    queryKey: ["get-active-key"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_keys")
        .select()
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });
};

// get roles
export const usGetRoles = () => {
  return useQuery({
    queryKey: ["get-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_type")
        .select(`id, name`);
      if (error) throw error;
      return data;
    },
  });
};

// inset keys to db
export const useUploadKey = () => {
  return useMutation({
    mutationFn: async (keyData) => {
      const { data, error } = await supabase
        .from("role_keys")
        .insert(keyData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    // onMutate: async (newKey) => {
    //   await queryClient.cancelQueries({
    //     queryKey: ["get-active-key"],
    //   });

    //   const previousKey = queryClient.getQueriesData(["get-active-key"]);

    //   //
    //   // Optimistically update cache
    //   queryClient.setQueryData(["get-active-key"], (old: any) => [
    //     ...(old || []),
    //     { ...newKey, id: Math.random().toString(), optimistic: true },
    //   ]);
    //   return { previousKey };
    // },
    // onError: (err, newKey, context) => {
    //   if (context?.previousKey) {
    //     queryClient.setQueryData(["get-active-key"], context.previousKey);
    //   }
    // },

    // // ✅ On success, replace optimistic data with actual data
    // onSuccess: (res) => {
    //   queryClient.setQueryData(["get-active-key"], (old: any) => [
    //     ...(old?.filter((v: any) => !v.optimistic) || []),
    //     res,
    //   ]);
    // },

    // // // 🔄 Refetch to ensure data is fully synced
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["get-active-key"] });
    // },
  });
};

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
        .select(
          `
            id,
            role_type_id,
            role_type(name,id),
            role_key,
            status
            `
        )
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
  });
};

// Update role key status
export const useUpdateRoleKey = () => {
  return useMutation({
    mutationFn: async ({ status, role_key }) => {
      const { data, error } = await supabase
        .from("role_keys")
        .update({ status: status })
        .eq("role_key", role_key);
      if (error) throw error;
      return data;
    },
  });
};

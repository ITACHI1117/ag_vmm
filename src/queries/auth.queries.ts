import { supabase } from "@/supabse-client";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await supabase.auth.signInWithPassword(data);
      return res.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await supabase.auth.signUp(data);
      return res.data;
    },
  });
};

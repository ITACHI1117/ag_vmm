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
  const SITE_URL =
    process.env.NODE_ENV === "production"
      ? "https://dashboard-ag-vmm.vercel.app/"
      : "http://localhost:3000";
  return useMutation({
    mutationFn: async (data) => {
      const res = await supabase.auth.signUp({
        ...data,
        options: {
          emailRedirectTo: `${SITE_URL}/auth/callback`,
        },
      });
      return res.data;
    },
  });
};

import { createClient } from "@supabase/supabase-js";

// get supabase api-key & anao-key from supabase
export const supabse = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_API_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

import { createBrowserClient } from "@supabase/ssr";

// get supabase api-key & anao-key from supabase
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
export const supabase = createClient();

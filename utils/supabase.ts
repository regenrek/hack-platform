import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.SUPABASE_URL;
  const supabaseKey = config.public.SUPABASE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  return supabase;
};

// If you need type safety, you can also export the client type
export type TypedSupabaseClient = SupabaseClient;

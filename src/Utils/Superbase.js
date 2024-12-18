import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const superbaseclinet = async (superbaseAccesToken) => {
  const token = superbaseAccesToken || supabaseKey; // Use the anon key as a fallback
  const superbase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  return superbase;
};

export default superbaseclinet;

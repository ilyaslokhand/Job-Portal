import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const superbaseclinet = async (superbaseAccesToken) => {
  const superbase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${superbaseAccesToken}`,
      },
    },
  });
  return superbase;
};

export default superbaseclinet;

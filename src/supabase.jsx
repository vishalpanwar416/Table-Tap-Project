import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "";
const supabaseAnonKey = "";
const supabaseServiceRoleKey = 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseStorage = createClient(supabaseUrl, supabaseServiceRoleKey);

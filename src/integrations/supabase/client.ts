// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lvgqigjgvhejuaglehpa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Z3FpZ2pndmhlanVhZ2xlaHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NzA3NjksImV4cCI6MjA0OTU0Njc2OX0.z8CWyDkxh7k8kXfMkfaWuuFWuG8k2YivF6OYQU17w1I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
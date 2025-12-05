//supabase.js

import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://ayzcsszkkzrtqixftkko.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5emNzc3pra3pydHFpeGZ0a2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTYzOTEsImV4cCI6MjA4MDE5MjM5MX0.rdsaeEeiKvyChAd9D5-Ryv8NCRr3OJo1ibqMWklv9q4";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

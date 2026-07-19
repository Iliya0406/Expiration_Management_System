const SUPABASE_URL =
"https://nsaanhvhpknisbtlydlq.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYWFuaHZocGtuaXNidGx5ZGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzc5MDQsImV4cCI6MjA5OTYxMzkwNH0.LOjriPa-f9PQWEhU-kwxMJxtxYHaUOw7yNHShelZOE4";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

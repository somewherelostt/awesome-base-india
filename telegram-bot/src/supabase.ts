import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { ProjectSubmission } from "./types";

function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set");
  return createClient(url, key);
}

export async function insertSubmission(submission: ProjectSubmission): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("project_submissions").insert(submission);
    return { error: error ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
}

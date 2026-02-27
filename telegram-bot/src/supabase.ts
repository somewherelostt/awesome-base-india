import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { ProjectSubmission } from "./types";

export interface EditIdRecord {
  edit_id: string;
  type: "founder" | "project";
  identifier: string;
}

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

/** Look up edit_id in registry (for /edit flow). */
export async function getEditIdRecord(editId: string): Promise<EditIdRecord | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("edit_id_registry")
      .select("edit_id, type, identifier")
      .eq("edit_id", editId.trim().toLowerCase())
      .maybeSingle();
    if (error || !data) return null;
    return data as EditIdRecord;
  } catch {
    return null;
  }
}

/** Store a pending MDX edit from the bot. */
export async function insertMdxEdit(params: {
  edit_id: string;
  mdx_content: string;
  telegram_user_id: number;
  telegram_username: string | null;
}): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("mdx_edits").insert({
      edit_id: params.edit_id,
      mdx_content: params.mdx_content,
      status: "pending",
      telegram_user_id: params.telegram_user_id,
      telegram_username: params.telegram_username,
    });
    return { error: error ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
}

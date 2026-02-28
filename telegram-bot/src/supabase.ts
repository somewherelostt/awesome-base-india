import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { ProjectSubmission } from "./types";

export interface EditIdRecord {
  edit_id: string;
  type: "founder" | "project";
  identifier: string;
}

export interface DirectoryProject {
  slug: string;
  name: string;
  description?: string | null;
  description_full?: string | null;
  category?: string | null;
  founder_name?: string | null;
  founder_twitter?: string | null;
  founder_twitter_handle?: string | null;
  founder_github?: string | null;
  url?: string | null;
  batch?: string | null;
  tags?: string | null;
  logo_url?: string | null;
  github_url?: string | null;
  farcaster_url?: string | null;
  youtube_url?: string | null;
  other_links?: string | null;
  prizes?: string | null;
}

export interface DirectoryFounder {
  username: string;
  name: string;
  city?: string | null;
  country?: string | null;
  short_bio?: string | null;
  profile_image?: string | null;
  github?: string | null;
  twitter?: string | null;
  hackathons_attended?: string | null;
  projects_built?: string | null;
  prizes_won?: string | null;
  prize_winnings_amount?: string | null;
  onchain_creds_claimed?: string | null;
  tags?: string | null;
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

export async function listDirectoryProjects(): Promise<{ data: { slug: string; name: string }[]; error: Error | null }> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("directory_projects").select("slug, name").order("name");
    if (!error && data && data.length > 0) return { data: data as { slug: string; name: string }[], error: null };
    const { data: reg } = await supabase.from("edit_id_registry").select("identifier").eq("type", "project").order("identifier");
    const list = (reg ?? []).map((r) => ({ slug: r.identifier, name: r.identifier }));
    return { data: list, error: null };
  } catch (e) {
    return { data: [], error: e instanceof Error ? e : new Error(String(e)) };
  }
}

export async function listDirectoryFounders(): Promise<{ data: { username: string; name: string }[]; error: Error | null }> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("directory_founders").select("username, name").order("name");
    if (!error && data && data.length > 0) return { data: data as { username: string; name: string }[], error: null };
    const { data: reg } = await supabase.from("edit_id_registry").select("identifier").eq("type", "founder").order("identifier");
    const list = (reg ?? []).map((r) => ({ username: r.identifier, name: r.identifier }));
    return { data: list, error: null };
  } catch (e) {
    return { data: [], error: e instanceof Error ? e : new Error(String(e)) };
  }
}

export async function getDirectoryProject(slug: string): Promise<DirectoryProject | null> {
  try {
    const supabase = getSupabase();
    const { data } = await supabase.from("directory_projects").select("*").eq("slug", slug).maybeSingle();
    return data as DirectoryProject | null;
  } catch {
    return null;
  }
}

export async function getDirectoryFounder(username: string): Promise<DirectoryFounder | null> {
  try {
    const supabase = getSupabase();
    const { data } = await supabase.from("directory_founders").select("*").eq("username", username).maybeSingle();
    return data as DirectoryFounder | null;
  } catch {
    return null;
  }
}

export async function updateDirectoryProject(
  slug: string,
  updates: Partial<DirectoryProject>,
  telegramUserId: number
): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("directory_projects")
      .update({ ...updates, telegram_user_id_edit: telegramUserId, updated_at: new Date().toISOString() })
      .eq("slug", slug);
    return { error: error ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
}

export async function updateDirectoryFounder(
  username: string,
  updates: Partial<DirectoryFounder>,
  telegramUserId: number
): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("directory_founders")
      .update({ ...updates, telegram_user_id_edit: telegramUserId, updated_at: new Date().toISOString() })
      .eq("username", username);
    return { error: error ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }
}

export async function insertFounderSubmission(row: {
  username: string;
  name: string;
  city?: string | null;
  country?: string | null;
  short_bio?: string | null;
  profile_image?: string | null;
  github?: string | null;
  twitter?: string | null;
  hackathons_attended?: string | null;
  projects_built?: string | null;
  prizes_won?: string | null;
  prize_winnings_amount?: string | null;
  onchain_creds_claimed?: string | null;
  tags?: string | null;
  telegram_user_id: number;
  telegram_username: string | null;
}): Promise<{ error: Error | null }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("founder_submissions").insert(row);
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

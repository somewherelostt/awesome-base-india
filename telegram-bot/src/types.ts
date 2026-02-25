/**
 * Types for bot submissions. Designed to map cleanly to frontend Project/Founder and Supabase.
 */

export interface TeammateEntry {
  name: string;
  twitter: string;
}

/** Main categories (Base ecosystem style: https://www.base.org/ecosystem) */
export const MAIN_CATEGORIES = ["AI", "Wallet", "Defi", "Consumer", "Onramp", "Infra"] as const;

/** Payload we send to Supabase (submissions table) */
export interface ProjectSubmission {
  product_name: string;
  project_url: string;
  description: string;
  logo_url: string | null;
  category: string | null;
  tags: string[];
  github_url: string | null;
  twitter_profile: string | null;
  founder_name: string;
  founder_twitter: string;
  teammates: TeammateEntry[];
  batch: string | null;
  status: "pending" | "approved" | "rejected";
  telegram_user_id: number;
  telegram_username: string | null;
  created_at: string;
}

/** In-memory state while user is filling the form */
export interface SubmissionState {
  product_name: string;
  project_url: string;
  description: string;
  logo_url: string | null;
  category: string | null;
  tags: string[];
  github_url: string | null;
  twitter_profile: string | null;
  founder_name: string;
  founder_twitter: string;
  teammates: TeammateEntry[];
}

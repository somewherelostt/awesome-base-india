/**
 * Types for bot submissions. Designed to map cleanly to frontend Project/Founder and Supabase.
 * Data stored in simple flat fields so you can copy from Supabase into MDX easily.
 */

export interface TeammateEntry {
  name: string;
  twitter: string;
}

/** Main categories (Base ecosystem style: https://www.base.org/ecosystem) */
export const MAIN_CATEGORIES = ["AI", "Wallet", "Defi", "Consumer", "Onramp", "Infra"] as const;

/** Batches for projects */
export const BATCHES = [
  "Base Batch India",
  "Based India",
  "Builder Track 002",
  "Build Onchain FBI",
  "Onchain AI BLR",
  "ClawdKitchen",
  "Independent",
] as const;

/** Payload we send to Supabase (project_submissions table) */
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

/** In-memory state while user is filling the project form */
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

/** In-memory state for new founder submission */
export interface FounderSubmissionState {
  username: string;
  name: string;
  city: string | null;
  country: string | null;
  short_bio: string | null;
  profile_image: string | null;
  github: string | null;
  twitter: string | null;
  hackathons_attended: string | null;
  projects_built: string | null;
  prizes_won: string | null;
  prize_winnings_amount: string | null;
  onchain_creds_claimed: string | null;
  tags: string | null;
}

/** Project fields that can be edited (key = Supabase column) */
export const PROJECT_EDIT_FIELDS = [
  "name", "description", "category", "founder_name", "founder_twitter", "url", "batch", "tags",
  "logo_url", "github_url", "farcaster_url", "youtube_url", "other_links", "prizes", "description_full",
] as const;

/** Founder fields that can be edited */
export const FOUNDER_EDIT_FIELDS = [
  "name", "username", "city", "country", "short_bio", "profile_image", "github", "twitter",
  "hackathons_attended", "projects_built", "prizes_won", "prize_winnings_amount", "onchain_creds_claimed", "tags",
] as const;

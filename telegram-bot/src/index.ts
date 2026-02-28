import "dotenv/config";
import http from "http";
import { Telegraf } from "telegraf";
import type { SubmissionState, FounderSubmissionState } from "./types";
import {
  MAIN_CATEGORIES,
  PROJECT_EDIT_FIELDS,
  FOUNDER_EDIT_FIELDS,
} from "./types";
import {
  insertSubmission,
  getEditIdRecord,
  insertMdxEdit,
  insertFounderSubmission,
  listDirectoryProjects,
  listDirectoryFounders,
  getDirectoryProject,
  getDirectoryFounder,
  updateDirectoryProject,
  updateDirectoryFounder,
  type EditIdRecord,
  type DirectoryProject,
  type DirectoryFounder,
} from "./supabase";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is required");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// ─── Project submission steps (new project) ─────────────────────────────────
type ProjectStep =
  | "product_name"
  | "project_url"
  | "description"
  | "logo_url"
  | "category"
  | "tags"
  | "github_url"
  | "twitter_profile"
  | "founder_name"
  | "founder_twitter"
  | "teammates";

// ─── Founder submission steps (new founder) ─────────────────────────────────
type FounderStep =
  | "username"
  | "name"
  | "city"
  | "country"
  | "short_bio"
  | "profile_image"
  | "github"
  | "twitter"
  | "hackathons_attended"
  | "projects_built"
  | "prizes_won"
  | "prize_winnings_amount"
  | "onchain_creds_claimed"
  | "tags";

type FlowType = "menu" | "existing_project" | "existing_founder" | "new_project" | "new_founder";

interface MenuFlow {
  type: "menu";
}

interface ExistingProjectFlow {
  type: "existing_project";
  step: "pick" | "show" | "edit_field" | "edit_value";
  slug?: string;
  editingField?: string;
}

interface ExistingFounderFlow {
  type: "existing_founder";
  step: "pick" | "show" | "edit_field" | "edit_value";
  username?: string;
  editingField?: string;
}

interface NewProjectFlow {
  type: "new_project";
  step: ProjectStep;
  state: Partial<SubmissionState>;
}

interface NewFounderFlow {
  type: "new_founder";
  step: FounderStep;
  state: Partial<FounderSubmissionState>;
}

type UserFlowState =
  | MenuFlow
  | ExistingProjectFlow
  | ExistingFounderFlow
  | NewProjectFlow
  | NewFounderFlow;

/** Flow for /edit <edit_id>: next message is full MDX content. */
interface EditFlow {
  edit_id: string;
  record: EditIdRecord;
}

const userFlows = new Map<number, UserFlowState>();
const editFlows = new Map<number, EditFlow>();

function setFlow(userId: number, flow: UserFlowState): void {
  userFlows.set(userId, flow);
}

function clearFlow(userId: number): void {
  userFlows.delete(userId);
}

function normalizeTwitter(input: string): string {
  const t = input.trim().replace(/^@/, "").split(/\s/)[0];
  return t || "";
}

function isValidUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

function parseTeammates(text: string): { name: string; twitter: string }[] {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const result: { name: string; twitter: string }[] = [];
  for (const line of lines) {
    const match = line.match(/^(.+?)\s+@?(\w+)\s*$/);
    if (match) {
      result.push({ name: match[1].trim(), twitter: match[2].trim() });
    } else if (line.includes("@")) {
      const at = line.indexOf("@");
      const twitter = line.slice(at).replace(/^@/, "").split(/\s/)[0];
      const name = line.slice(0, at).trim();
      if (name && twitter) result.push({ name, twitter });
    }
  }
  return result;
}

/** Format project/founder row as simple key: value lines for easy copy from Supabase. */
function formatProjectSimple(p: DirectoryProject): string {
  const lines: string[] = [];
  const add = (k: string, v: unknown) => {
    if (v != null && String(v).trim() !== "") lines.push(`${k}: ${String(v).trim()}`);
  };
  add("slug", p.slug);
  add("name", p.name);
  add("description", p.description);
  add("description_full", p.description_full);
  add("category", p.category);
  add("founder_name", p.founder_name);
  add("founder_twitter", p.founder_twitter);
  add("founder_twitter_handle", p.founder_twitter_handle);
  add("founder_github", p.founder_github);
  add("url", p.url);
  add("batch", p.batch);
  add("tags", p.tags);
  add("logo_url", p.logo_url);
  add("github_url", p.github_url);
  add("farcaster_url", p.farcaster_url);
  add("youtube_url", p.youtube_url);
  add("other_links", p.other_links);
  add("prizes", p.prizes);
  return lines.join("\n");
}

function formatFounderSimple(f: DirectoryFounder): string {
  const lines: string[] = [];
  const add = (k: string, v: unknown) => {
    if (v != null && String(v).trim() !== "") lines.push(`${k}: ${String(v).trim()}`);
  };
  add("username", f.username);
  add("name", f.name);
  add("city", f.city);
  add("country", f.country);
  add("short_bio", f.short_bio);
  add("profile_image", f.profile_image);
  add("github", f.github);
  add("twitter", f.twitter);
  add("hackathons_attended", f.hackathons_attended);
  add("projects_built", f.projects_built);
  add("prizes_won", f.prizes_won);
  add("prize_winnings_amount", f.prize_winnings_amount);
  add("onchain_creds_claimed", f.onchain_creds_claimed);
  add("tags", f.tags);
  return lines.join("\n");
}

const WELCOME =
  "👋 *Welcome to Base India Circle*\n\n" +
  "We're the directory for products and founders building on Base from India. Choose an option below.";

// ─── Start menu: Existing project / Existing founder / New project / New founder ───
function sendStartMenu(ctx: { reply: (text: string, opts?: { parse_mode?: "Markdown"; reply_markup?: unknown }) => Promise<unknown> }) {
  ctx.reply(WELCOME, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📋 Existing project", callback_data: "menu_existing_project" },
          { text: "👤 Existing founder", callback_data: "menu_existing_founder" },
        ],
        [
          { text: "🆕 New project", callback_data: "menu_new_project" },
          { text: "🆕 New founder", callback_data: "menu_new_founder" },
        ],
      ],
    },
  });
}

bot.start((ctx) => {
  setFlow(ctx.from?.id ?? 0, { type: "menu" });
  sendStartMenu(ctx);
});

bot.command("submit", (ctx) => {
  setFlow(ctx.from?.id ?? 0, { type: "menu" });
  sendStartMenu(ctx);
});

bot.command("cancel", (ctx) => {
  const userId = ctx.from?.id;
  if (userId) {
    clearFlow(userId);
    editFlows.delete(userId);
  }
  ctx.reply("Cancelled. Send /start to choose again.");
});

// ─── Callback: menu choice ──────────────────────────────────────────────────
bot.action(/^menu_(.+)$/, async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  const match = ctx.match;
  const choice = match[1] as string;

  if (choice === "existing_project") {
    const { data: list, error } = await listDirectoryProjects();
    await ctx.answerCbQuery();
    if (error || !list.length) {
      await ctx.reply(
        "No projects in the directory yet. You can submit a *new project* with /start → New project, or ask the team to seed the directory.",
        { parse_mode: "Markdown" }
      );
      setFlow(userId, { type: "menu" });
      return;
    }
    setFlow(userId, { type: "existing_project", step: "pick" });
    const text =
      "*Select a project* (reply with the *exact name* or *number*):\n\n" +
      list.map((p, i) => `${i + 1}. ${p.name} (\`${p.slug}\`)`).join("\n");
    await ctx.reply(text, { parse_mode: "Markdown" });
    return;
  }

  if (choice === "existing_founder") {
    const { data: list, error } = await listDirectoryFounders();
    await ctx.answerCbQuery();
    if (error || !list.length) {
      await ctx.reply(
        "No founders in the directory yet. You can add a *new founder* with /start → New founder, or ask the team to seed the directory.",
        { parse_mode: "Markdown" }
      );
      setFlow(userId, { type: "menu" });
      return;
    }
    setFlow(userId, { type: "existing_founder", step: "pick" });
    const text =
      "*Select a founder* (reply with the *exact name* or *username* or *number*):\n\n" +
      list.map((f, i) => `${i + 1}. ${f.name} (\`${f.username}\`)`).join("\n");
    await ctx.reply(text, { parse_mode: "Markdown" });
    return;
  }

  if (choice === "new_project") {
    await ctx.answerCbQuery();
    setFlow(userId, {
      type: "new_project",
      step: "product_name",
      state: {},
    });
    await ctx.reply(
      "🆕 *New project*\n\nI'll ask for: name, link, description, category, founder, teammates, etc. You can *\/skip* optional fields and *\/cancel* anytime.\n\n*What is your product/project name?*",
      { parse_mode: "Markdown" }
    );
    return;
  }

  if (choice === "new_founder") {
    await ctx.answerCbQuery();
    setFlow(userId, {
      type: "new_founder",
      step: "username",
      state: {},
    });
    await ctx.reply(
      "🆕 *New founder*\n\nI'll ask for: username (Devfolio/X), name, city, bio, profile image, github, twitter, tags. You can *\/skip* optional fields and *\/cancel* anytime.\n\n*Username* (e.g. Devfolio handle or X handle):",
      { parse_mode: "Markdown" }
    );
    return;
  }

  await ctx.answerCbQuery();
});

// ─── /edit <edit_id> flow (unchanged) ───────────────────────────────────────
bot.command("edit", async (ctx) => {
  const userId = ctx.from?.id;
  const text = (ctx.message as { text?: string }).text ?? "";
  const parts = text.trim().split(/\s+/);
  const editId = parts[1]?.trim();
  if (!userId) return;
  if (!editId) {
    await ctx.reply(
      "Use your *edit_id* from your profile or project MDX (frontmatter).\n\nExample: `/edit dv8x2k9m`\n\nThen send your full MDX (frontmatter + body) in the next message.",
      { parse_mode: "Markdown" }
    );
    return;
  }
  const record = await getEditIdRecord(editId);
  if (!record) {
    await ctx.reply("Unknown edit_id. If you don't have one yet, ask the team to add it to your profile/project file.");
    return;
  }
  editFlows.set(userId, { edit_id: editId, record });
  await ctx.reply(
    `Editing *${record.type}*: \`${record.identifier}\`.\n\nSend your *full MDX content* in the next message. We'll store it for review and update the file after approval.\n\nSend /cancel to abort.`,
    { parse_mode: "Markdown" }
  );
});

// ─── Handle /edit flow: next message is MDX ─────────────────────────────────
async function handleEditFlow(ctx: { from?: { id?: number }; message?: { text?: string }; reply: (t: string, o?: { parse_mode?: "Markdown" }) => Promise<unknown> }, text: string, userId: number, username: string | null): Promise<boolean> {
  const editFlow = editFlows.get(userId);
  if (!editFlow) return false;
  if (text.toLowerCase() === "/cancel") {
    editFlows.delete(userId);
    await ctx.reply("Edit cancelled.");
    return true;
  }
  const { error } = await insertMdxEdit({
    edit_id: editFlow.edit_id,
    mdx_content: text,
    telegram_user_id: userId,
    telegram_username: username,
  });
  editFlows.delete(userId);
  if (error) {
    await ctx.reply("Failed to save. Please try again or contact the team.");
    return true;
  }
  await ctx.reply("✅ *MDX update received.* We'll review and replace the file after approval.", { parse_mode: "Markdown" });
  return true;
}

// ─── Existing project: pick → show → edit field → edit value ────────────────
async function handleExistingProject(ctx: { reply: (t: string, o?: { parse_mode?: "Markdown" }) => Promise<unknown> }, userId: number, text: string): Promise<boolean> {
  const flow = userFlows.get(userId);
  if (!flow || flow.type !== "existing_project") return false;

  if (flow.step === "pick") {
    const { data: list } = await listDirectoryProjects();
    const byName = new Map(list.map((p) => [p.name.toLowerCase(), p.slug]));
    const bySlug = new Map(list.map((p) => [p.slug.toLowerCase(), p.slug]));
    const byNum = list.map((p) => p.slug);
    const t = text.trim().toLowerCase();
    let slug: string | undefined = byName.get(t) ?? bySlug.get(t);
    if (!slug && /^\d+$/.test(t)) {
      const i = parseInt(t, 10);
      if (i >= 1 && i <= byNum.length) slug = byNum[i - 1];
    }
    if (!slug) {
      await ctx.reply("Not found. Reply with the exact project name or number from the list, or /cancel.");
      return true;
    }
    const project = await getDirectoryProject(slug);
    if (!project) {
      await ctx.reply(
        `Project \`${slug}\` isn't in the directory table yet. Use /edit <edit_id> to send full MDX, or ask the team to seed the directory.`,
        { parse_mode: "Markdown" }
      );
      setFlow(userId, { type: "menu" });
      return true;
    }
    setFlow(userId, { type: "existing_project", step: "show", slug });
    const preview = formatProjectSimple(project);
    await ctx.reply(
      `*Current data* (copy from Supabase later):\n\`\`\`\n${preview}\n\`\`\`\n\nTo edit a field, reply with the *field name* (e.g. \`name\`, \`description\`). Or /done to finish.`,
      { parse_mode: "Markdown" }
    );
    return true;
  }

  if (flow.step === "show" && flow.slug) {
    if (text.trim().toLowerCase() === "/done") {
      await ctx.reply("✅ Edits are saved in Supabase. We'll update the MDX file manually. Send /start for more.");
      setFlow(userId, { type: "menu" });
      return true;
    }
    const field = text.trim().toLowerCase().replace(/\s+/g, "_");
    const valid = PROJECT_EDIT_FIELDS.includes(field as typeof PROJECT_EDIT_FIELDS[number]);
    if (!valid) {
      await ctx.reply(`Unknown field. Use one of: ${PROJECT_EDIT_FIELDS.join(", ")}. Or /done to finish.`);
      return true;
    }
    setFlow(userId, { type: "existing_project", step: "edit_value", slug: flow.slug, editingField: field });
    await ctx.reply(`Send the *new value* for \`${field}\`:`, { parse_mode: "Markdown" });
    return true;
  }

  if (flow.step === "edit_value" && flow.slug && flow.editingField) {
    const key = flow.editingField as keyof DirectoryProject;
    const updates: Partial<DirectoryProject> = { [key]: text.trim() || null } as Partial<DirectoryProject>;
    const { error } = await updateDirectoryProject(flow.slug, updates, userId);
    if (error) {
      await ctx.reply("Failed to save. Try again or contact the team.");
      return true;
    }
    setFlow(userId, { type: "existing_project", step: "show", slug: flow.slug });
    await ctx.reply("✅ Updated. Edit another field or /done to finish.");
    return true;
  }

  return false;
}

// ─── Existing founder: same pattern ────────────────────────────────────────
async function handleExistingFounder(ctx: { reply: (t: string, o?: { parse_mode?: "Markdown" }) => Promise<unknown> }, userId: number, text: string): Promise<boolean> {
  const flow = userFlows.get(userId);
  if (!flow || flow.type !== "existing_founder") return false;

  if (flow.step === "pick") {
    const { data: list } = await listDirectoryFounders();
    const byName = new Map(list.map((f) => [f.name.toLowerCase(), f.username]));
    const byUser = new Map(list.map((f) => [f.username.toLowerCase(), f.username]));
    const byNum = list.map((f) => f.username);
    const t = text.trim().toLowerCase();
    let username: string | undefined = byName.get(t) ?? byUser.get(t);
    if (!username && /^\d+$/.test(t)) {
      const i = parseInt(t, 10);
      if (i >= 1 && i <= byNum.length) username = byNum[i - 1];
    }
    if (!username) {
      await ctx.reply("Not found. Reply with the exact founder name or username or number, or /cancel.");
      return true;
    }
    const founder = await getDirectoryFounder(username);
    if (!founder) {
      await ctx.reply(
        `Founder \`${username}\` isn't in the directory table yet. Use /edit <edit_id> to send full MDX, or ask the team to seed the directory.`,
        { parse_mode: "Markdown" }
      );
      setFlow(userId, { type: "menu" });
      return true;
    }
    setFlow(userId, { type: "existing_founder", step: "show", username });
    const preview = formatFounderSimple(founder);
    await ctx.reply(
      `*Current data*:\n\`\`\`\n${preview}\n\`\`\`\n\nReply with a *field name* to edit (e.g. \`name\`, \`city\`). Or /done to finish.`,
      { parse_mode: "Markdown" }
    );
    return true;
  }

  if (flow.step === "show" && flow.username) {
    if (text.trim().toLowerCase() === "/done") {
      await ctx.reply("✅ Edits saved in Supabase. We'll update the MDX file manually. Send /start for more.");
      setFlow(userId, { type: "menu" });
      return true;
    }
    const field = text.trim().toLowerCase().replace(/\s+/g, "_");
    const valid = FOUNDER_EDIT_FIELDS.includes(field as typeof FOUNDER_EDIT_FIELDS[number]);
    if (!valid) {
      await ctx.reply(`Unknown field. Use one of: ${FOUNDER_EDIT_FIELDS.join(", ")}. Or /done to finish.`);
      return true;
    }
    setFlow(userId, { type: "existing_founder", step: "edit_value", username: flow.username, editingField: field });
    await ctx.reply(`Send the *new value* for \`${field}\`:`, { parse_mode: "Markdown" });
    return true;
  }

  if (flow.step === "edit_value" && flow.username && flow.editingField) {
    const key = flow.editingField as keyof DirectoryFounder;
    const updates: Partial<DirectoryFounder> = { [key]: text.trim() || null } as Partial<DirectoryFounder>;
    const { error } = await updateDirectoryFounder(flow.username, updates, userId);
    if (error) {
      await ctx.reply("Failed to save. Try again or contact the team.");
      return true;
    }
    setFlow(userId, { type: "existing_founder", step: "show", username: flow.username });
    await ctx.reply("✅ Updated. Edit another field or /done to finish.");
    return true;
  }

  return false;
}

// ─── New project flow (same steps as before) ──────────────────────────────────
async function handleNewProject(
  ctx: { reply: (t: string, o?: { parse_mode?: "Markdown" }) => Promise<unknown> },
  userId: number,
  username: string | null,
  text: string
): Promise<boolean> {
  const flow = userFlows.get(userId);
  if (!flow || flow.type !== "new_project") return false;

  const { step, state } = flow;

  if (step === "product_name") {
    state.product_name = text;
    flow.step = "project_url";
    await ctx.reply("What is the *project link* (website or app URL)?", { parse_mode: "Markdown" });
    return true;
  }
  if (step === "project_url") {
    if (!isValidUrl(text)) {
      await ctx.reply("Please send a valid URL (e.g. https://yourproject.xyz).");
      return true;
    }
    state.project_url = text;
    flow.step = "description";
    await ctx.reply("Give a *short description* of the project.", { parse_mode: "Markdown" });
    return true;
  }
  if (step === "description") {
    state.description = text;
    flow.step = "logo_url";
    await ctx.reply("Optional: *Logo image URL*. Send /skip to skip.", { parse_mode: "Markdown" });
    return true;
  }
  if (step === "logo_url") {
    if (text.toLowerCase() === "/skip") state.logo_url = null;
    else if (isValidUrl(text)) state.logo_url = text;
    else {
      await ctx.reply("Send a valid image URL or /skip.");
      return true;
    }
    flow.step = "category";
    await ctx.reply(`*Category* (one of): ${MAIN_CATEGORIES.join(", ")}`, { parse_mode: "Markdown" });
    return true;
  }
  if (step === "category") {
    const match = MAIN_CATEGORIES.find((c) => c.toLowerCase() === text.trim().toLowerCase());
    if (!match) {
      await ctx.reply(`Choose one of: ${MAIN_CATEGORIES.join(", ")}`);
      return true;
    }
    state.category = match;
    flow.step = "tags";
    await ctx.reply("Optional: *Tags* (comma-separated). Send /skip to skip.", { parse_mode: "Markdown" });
    return true;
  }
  if (step === "tags") {
    state.tags = text.toLowerCase() === "/skip" ? [] : text.split(",").map((t) => t.trim()).filter(Boolean);
    flow.step = "github_url";
    await ctx.reply("Optional: *GitHub link*. Send /skip to skip.", { parse_mode: "Markdown" });
    return true;
  }
  if (step === "github_url") {
    if (text.toLowerCase() === "/skip") state.github_url = null;
    else if (isValidUrl(text)) state.github_url = text;
    else {
      await ctx.reply("Valid URL or /skip.");
      return true;
    }
    flow.step = "twitter_profile";
    await ctx.reply("Optional: *Project Twitter/X*. Send /skip to skip.", { parse_mode: "Markdown" });
    return true;
  }
  if (step === "twitter_profile") {
    if (text.toLowerCase() === "/skip") state.twitter_profile = null;
    else state.twitter_profile = text.includes("twitter.com") || text.includes("x.com") ? text : normalizeTwitter(text);
    flow.step = "founder_name";
    await ctx.reply("Who is the *founder*? (Full name)");
    return true;
  }
  if (step === "founder_name") {
    state.founder_name = text;
    flow.step = "founder_twitter";
    await ctx.reply("Founder's *Twitter/X handle*:");
    return true;
  }
  if (step === "founder_twitter") {
    state.founder_twitter = normalizeTwitter(text);
    flow.step = "teammates";
    await ctx.reply("Optional: *Teammates* — one per line: `Name @handle`. Send /skip if solo.", { parse_mode: "Markdown" });
    return true;
  }
  if (step === "teammates") {
    state.teammates = text.toLowerCase() === "/skip" ? [] : parseTeammates(text);
    const submission = {
      product_name: state.product_name!,
      project_url: state.project_url!,
      description: state.description!,
      logo_url: state.logo_url ?? null,
      category: state.category ?? null,
      tags: state.tags ?? [],
      github_url: state.github_url ?? null,
      twitter_profile: state.twitter_profile ?? null,
      founder_name: state.founder_name!,
      founder_twitter: state.founder_twitter!,
      teammates: state.teammates ?? [],
      batch: null,
      status: "pending" as const,
      telegram_user_id: userId,
      telegram_username: username,
      created_at: new Date().toISOString(),
    };
    const { error } = await insertSubmission(submission);
    clearFlow(userId);
    if (error) {
      await ctx.reply("Something went wrong saving. Please try again or contact the team.");
      return true;
    }
    await ctx.reply("✅ *Submission received.* We'll verify and add you to the directory. You can copy the submission from Supabase when updating MDX.", { parse_mode: "Markdown" });
    return true;
  }

  return false;
}

// ─── New founder flow ──────────────────────────────────────────────────────
const FOUNDER_STEPS: { step: FounderStep; prompt: string; optional?: boolean }[] = [
  { step: "username", prompt: "Username (Devfolio or X handle)" },
  { step: "name", prompt: "Full name" },
  { step: "city", prompt: "City", optional: true },
  { step: "country", prompt: "Country", optional: true },
  { step: "short_bio", prompt: "Short bio", optional: true },
  { step: "profile_image", prompt: "Profile image URL", optional: true },
  { step: "github", prompt: "GitHub URL", optional: true },
  { step: "twitter", prompt: "Twitter/X URL or handle", optional: true },
  { step: "hackathons_attended", prompt: "Hackathons attended (number)", optional: true },
  { step: "projects_built", prompt: "Projects built (number)", optional: true },
  { step: "prizes_won", prompt: "Prizes won (number)", optional: true },
  { step: "prize_winnings_amount", prompt: "Prize winnings amount", optional: true },
  { step: "onchain_creds_claimed", prompt: "Onchain creds claimed (number)", optional: true },
  { step: "tags", prompt: "Tags (comma-separated)", optional: true },
];

async function handleNewFounder(
  ctx: { reply: (t: string, o?: { parse_mode?: "Markdown" }) => Promise<unknown> },
  userId: number,
  username: string | null,
  text: string
): Promise<boolean> {
  const flow = userFlows.get(userId);
  if (!flow || flow.type !== "new_founder") return false;

  const idx = FOUNDER_STEPS.findIndex((s) => s.step === flow.step);
  if (idx < 0) return false;

  const optional = FOUNDER_STEPS[idx].optional;
  const value = text.trim().toLowerCase() === "/skip" ? null : text.trim();
  if (!optional && (value === null || value === "")) {
    await ctx.reply("This field is required. Send a value or /cancel.");
    return true;
  }

  (flow.state as Record<string, unknown>)[flow.step] = value;

  if (idx + 1 >= FOUNDER_STEPS.length) {
    const { error } = await insertFounderSubmission({
      username: flow.state.username!,
      name: flow.state.name!,
      city: flow.state.city ?? null,
      country: flow.state.country ?? null,
      short_bio: flow.state.short_bio ?? null,
      profile_image: flow.state.profile_image ?? null,
      github: flow.state.github ?? null,
      twitter: flow.state.twitter ?? null,
      hackathons_attended: flow.state.hackathons_attended ?? null,
      projects_built: flow.state.projects_built ?? null,
      prizes_won: flow.state.prizes_won ?? null,
      prize_winnings_amount: flow.state.prize_winnings_amount ?? null,
      onchain_creds_claimed: flow.state.onchain_creds_claimed ?? null,
      tags: flow.state.tags ?? null,
      telegram_user_id: userId,
      telegram_username: username,
    });
    clearFlow(userId);
    if (error) {
      await ctx.reply("Failed to save. Try again or contact the team.");
      return true;
    }
    await ctx.reply("✅ *Founder submission received.* Data is in Supabase — you can copy from there when creating the MDX file.", { parse_mode: "Markdown" });
    return true;
  }

  flow.step = FOUNDER_STEPS[idx + 1].step;
  const next = FOUNDER_STEPS[idx + 1];
  const opt = next.optional ? " (or /skip)" : "";
  await ctx.reply(`${next.prompt}${opt}:`, { parse_mode: "Markdown" });
  return true;
}

// ─── Text handler ───────────────────────────────────────────────────────────
bot.on("text", async (ctx) => {
  const userId = ctx.from?.id;
  const username = ctx.from?.username ?? null;
  if (!userId) return;

  const text = (ctx.message as { text?: string }).text?.trim() ?? "";
  if (!text) return;

  if (await handleEditFlow(ctx, text, userId, username)) return;
  if (await handleExistingProject(ctx, userId, text)) return;
  if (await handleExistingFounder(ctx, userId, text)) return;
  if (await handleNewProject(ctx, userId, username, text)) return;
  if (await handleNewFounder(ctx, userId, username, text)) return;
});

// ─── Webhook server ────────────────────────────────────────────────────────
const WEBHOOK_BASE = process.env.WEBHOOK_BASE_URL || process.env.RENDER_EXTERNAL_URL;
const WEBHOOK_PATH = "/webhook";
const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  if ((req.method === "GET" || req.method === "HEAD") && req.url !== WEBHOOK_PATH) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }
  if (req.method === "POST" && req.url === WEBHOOK_PATH) {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let update: unknown;
      try {
        update = JSON.parse(body);
      } catch {
        res.writeHead(400);
        res.end();
        return;
      }
      bot.handleUpdate(update as Parameters<typeof bot.handleUpdate>[0], res).then(() => {
        if (!res.writableEnded) {
          res.writeHead(200);
          res.end();
        }
      }).catch((err) => {
        console.error("Webhook error:", err);
        if (!res.writableEnded) {
          res.writeHead(500);
          res.end();
        }
      });
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, async () => {
  console.log(`Health server on :${PORT}`);
  if (WEBHOOK_BASE) {
    const url = `${WEBHOOK_BASE.replace(/\/$/, "")}${WEBHOOK_PATH}`;
    await bot.telegram.setWebhook(url);
    console.log("Bot running (webhook):", url);
  } else {
    await bot.launch();
    console.log("Bot running (polling).");
  }
});

process.once("SIGINT", () => {
  server.close();
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  server.close();
  bot.stop("SIGTERM");
});

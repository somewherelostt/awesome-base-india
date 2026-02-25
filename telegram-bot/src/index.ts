import "dotenv/config";
import { Telegraf, type Context } from "telegraf";
import type { SubmissionState } from "./types";
import { insertSubmission } from "./supabase";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is required");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

type Step =
  | "product_name"
  | "project_url"
  | "description"
  | "github_url"
  | "twitter_profile"
  | "founder_name"
  | "founder_twitter"
  | "teammates";

interface UserFlow {
  step: Step;
  state: Partial<SubmissionState>;
}

const userFlows = new Map<number, UserFlow>();

function getOrCreateFlow(userId: number): UserFlow {
  let flow = userFlows.get(userId);
  if (!flow) {
    flow = { step: "product_name", state: {} };
    userFlows.set(userId, flow);
  }
  return flow;
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

bot.start((ctx) => {
  ctx.reply(
    "Welcome to Base India Circle submission bot.\n\n" +
      "I’ll ask you a few questions about your project. Reply in order; you can type /skip for optional fields and /cancel to abort.\n\n" +
      "First: *What is your product/project name?*",
    { parse_mode: "Markdown" }
  );
  const userId = ctx.from?.id;
  if (userId) getOrCreateFlow(userId);
});

bot.command("submit", (ctx) => {
  ctx.reply("What is your *product/project name?*", { parse_mode: "Markdown" });
  const userId = ctx.from?.id;
  if (userId) getOrCreateFlow(userId);
});

bot.command("cancel", (ctx) => {
  const userId = ctx.from?.id;
  if (userId) clearFlow(userId);
  ctx.reply("Submission cancelled. Send /start or /submit to begin again.");
});

bot.on("text", async (ctx) => {
  const userId = ctx.from?.id;
  const username = ctx.from?.username ?? null;
  if (!userId) return;

  const flow = userFlows.get(userId);
  if (!flow) return;

  const text = (ctx.message as { text?: string }).text?.trim() ?? "";
  if (!text) return;

  const { step, state } = flow;

  if (step === "product_name") {
    state.product_name = text;
    flow.step = "project_url";
    await ctx.reply("Got it. What is the *project link* (website or app URL)?", { parse_mode: "Markdown" });
    return;
  }

  if (step === "project_url") {
    if (!isValidUrl(text)) {
      await ctx.reply("Please send a valid URL (e.g. https://yourproject.xyz).");
      return;
    }
    state.project_url = text;
    flow.step = "description";
    await ctx.reply("Nice. Give a *short description* of the project (what it does, who it’s for).", { parse_mode: "Markdown" });
    return;
  }

  if (step === "description") {
    state.description = text;
    flow.step = "github_url";
    await ctx.reply(
      "Optional: *GitHub link* for the project. Send /skip to skip.",
      { parse_mode: "Markdown" }
    );
    return;
  }

  if (step === "github_url") {
    if (text.toLowerCase() === "/skip") {
      state.github_url = null;
    } else if (isValidUrl(text)) {
      state.github_url = text;
    } else {
      await ctx.reply("Send a valid URL or /skip.");
      return;
    }
    flow.step = "twitter_profile";
    await ctx.reply(
      "Optional: *Project’s Twitter/X profile* (handle or profile URL). Send /skip to skip.",
      { parse_mode: "Markdown" }
    );
    return;
  }

  if (step === "twitter_profile") {
    if (text.toLowerCase() === "/skip") {
      state.twitter_profile = null;
    } else {
      state.twitter_profile = text.includes("twitter.com") || text.includes("x.com") ? text : normalizeTwitter(text);
    }
    flow.step = "founder_name";
    await ctx.reply("Who is the *founder*? (Full name)");
    return;
  }

  if (step === "founder_name") {
    state.founder_name = text;
    flow.step = "founder_twitter";
    await ctx.reply("Founder’s *Twitter/X handle* (e.g. @username or username):", { parse_mode: "Markdown" });
    return;
  }

  if (step === "founder_twitter") {
    state.founder_twitter = normalizeTwitter(text);
    flow.step = "teammates";
    await ctx.reply(
      "Optional: *Teammates* — one per line, format: `Name @handle`\nExample:\nJane @jane\nJohn @johndoe\n\nSend /skip if you’re solo.",
      { parse_mode: "Markdown" }
    );
    return;
  }

  if (step === "teammates") {
    state.teammates = text.toLowerCase() === "/skip" ? [] : parseTeammates(text);

    const submission = {
      product_name: state.product_name!,
      project_url: state.project_url!,
      description: state.description!,
      github_url: state.github_url ?? null,
      twitter_profile: state.twitter_profile ?? null,
      founder_name: state.founder_name!,
      founder_twitter: state.founder_twitter!,
      teammates: state.teammates ?? [],
      category: null,
      batch: null,
      status: "pending" as const,
      telegram_user_id: userId,
      telegram_username: username,
      created_at: new Date().toISOString(),
    };

    const { error } = await insertSubmission(submission);
    clearFlow(userId);

    if (error) {
      await ctx.reply("Something went wrong saving your submission. Please try again or contact the team.");
      console.error("Supabase insert error:", error);
      return;
    }

    await ctx.reply(
      "✅ *Submission received.*\n\nWe’ll verify it and add you to the directory. You’ll hear from us once it’s live.",
      { parse_mode: "Markdown" }
    );
  }
});

bot.launch().then(() => console.log("Bot running."));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

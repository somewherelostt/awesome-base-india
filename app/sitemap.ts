import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { projects } from "@/lib/data";
import { getAllFounderUsernames } from "@/lib/founder";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const lastMod = new Date();

  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug ?? p.id}`,
    lastModified: lastMod,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const founderUsernames = getAllFounderUsernames();
  const fromProjects = [...new Set(projects.map((p) => p.founderTwitter).filter(Boolean))];
  const allFounders = [...new Set([...founderUsernames, ...fromProjects])];
  const founderUrls = allFounders.map((username) => ({
    url: `${baseUrl}/founders/${username}`,
    lastModified: lastMod,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: baseUrl, lastModified: lastMod, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/directory`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.7 },
    ...projectUrls,
    ...founderUrls,
  ];
}

import type { MetadataRoute } from "next";

import { getGames, getLessonsByGameSlug } from "@/lib/data";

const BASE_URL = "https://learnbyplay.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const games = getGames();

  const gameEntries: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${BASE_URL}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const lessonEntries: MetadataRoute.Sitemap = games.flatMap((game) =>
    getLessonsByGameSlug(game.slug).map((lesson) => ({
      url: `${BASE_URL}/lessons/${lesson.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/pd`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...gameEntries,
    ...lessonEntries,
  ];
}

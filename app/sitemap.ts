import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date("2026-07-24T00:00:00+07:00"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

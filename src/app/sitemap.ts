import { MetadataRoute } from "next";
import { getBusinessTypes, getStateReferenceTable } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cleared.example";
  const businessTypes = getBusinessTypes();
  const states = getStateReferenceTable().states;

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  for (const business of businessTypes) {
    routes.push({
      url: `${baseUrl}/business-type/${business.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });

    for (const state of states) {
      routes.push({
        url: `${baseUrl}/business-type/${business.slug}/${state.state_name.toLowerCase().replace(/\s+/g, "-")}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return routes;
}

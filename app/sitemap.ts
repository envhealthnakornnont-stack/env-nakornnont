import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://behn.go.th";

  const routes = [
    "/", "/public-services", "/about/personnel/management", "/about/structure", "/about/roles", "/departments/general-affairs",
    "/departments/public-health-promotion", "/departments/environmental-health-services", "/departments/environmental-health-promotion", 
    "/news/news-updates", "/news/activities", "/contact", "/policies/privacy", "/policies/terms", "/accessibility", "/sitemap"
  ];

  const now = new Date().toISOString();

  return routes.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "/" ? 1.0 : 0.6,
  }));
}

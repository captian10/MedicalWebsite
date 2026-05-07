import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // ✅ Hardcoded to guarantee search engines never see localhost
  const baseUrl = "https://megamedicalacademy.com";

  return {
    rules: [
      {
        // 1. Explicitly allow Facebook and WhatsApp to scrape the site
        userAgent: ["facebookexternalhit", "WhatsApp"],
        allow: "/",
      },
      {
        // 2. Rules for Google and everyone else
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/auth/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://getvellox.vercel.app";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/(protected)/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

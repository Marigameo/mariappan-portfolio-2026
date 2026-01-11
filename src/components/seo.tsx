import { Helmet } from "react-helmet-async"
import { seoConfig, structuredData } from "@/data/seo"

interface SEOProps {
  title?: string
  description?: string
  name?: string
  type?: string
  image?: string
}

export function SEO({
  title = seoConfig.title,
  description = seoConfig.description,
  name = seoConfig.author,
  type = "website",
  image = seoConfig.image,
}: SEOProps) {
  const fullImageUrl = image.startsWith("http") ? image : `${seoConfig.siteUrl}${image}`
  const pageUrl = seoConfig.siteUrl

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={seoConfig.keywords.join(", ")} />
      <meta name="author" content={name} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={seoConfig.twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  )
}

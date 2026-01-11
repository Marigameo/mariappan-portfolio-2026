import { Helmet } from "react-helmet-async"

interface SEOProps {
  title?: string
  description?: string
  name?: string
  type?: string
}

export function SEO({
  title = "Mariappan Portfolio",
  description = "Product Engineer passionate about creating exceptional digital experiences",
  name = "Mariappan Subramanian",
  type = "website",
}: SEOProps) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}

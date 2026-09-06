// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs, Open Graph tags and the sitemap.
  site: 'https://mariappan.netlify.app',
  // Every page lives at a folder URL with a trailing slash (/about/, /work/<slug>/),
  // exactly like the old hand-written site, so no links or SEO signals change.
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Keep the authored HTML whitespace as-is. The .flow diagrams and inline SVG
  // sketches depend on it, and gzip already removes the cost.
  compressHTML: false,
});

/* /sitemap.xml, built from the pages in src/pages at build time (404 excluded).
   Keeps the same URL the old hand-written sitemap had, so robots.txt and Search Console
   need no change. lastmod comes from each page file's last git commit. */
import type { APIRoute } from 'astro';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const pages = import.meta.glob('./**/*.astro', { eager: false });

function toPath(file: string): string {
  // './index.astro' -> '/', './about.astro' -> '/about/', './work/x.astro' -> '/work/x/'
  const route = file.replace(/^\.\//, '').replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
  return route ? `/${route}/` : '/';
}

function lastmod(file: string): string {
  try {
    const abs = fileURLToPath(new URL(file, import.meta.url));
    const iso = execSync(`git log -1 --format=%cI -- "${abs}"`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (iso) return iso.slice(0, 10);
  } catch { /* no git (e.g. a tarball build): fall through */ }
  return new Date().toISOString().slice(0, 10);
}

export const GET: APIRoute = ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const urls = Object.keys(pages)
    .filter((f) => !/\/404\.astro$/.test(f) && !/(^|\/)_/.test(f))
    .map((f) => ({ path: toPath(f), lastmod: lastmod(f) }))
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(({ path, lastmod }) => {
      const priority = path === '/' ? '1.0' : path.startsWith('/work/') ? '0.8' : '0.8';
      return `  <url><loc>${base}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

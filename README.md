# 🎨 Fully Vibe-Coded Portfolio (yes, even this README—LLM did it)

[![Netlify Status](https://img.shields.io/badge/netlify-deployed-00C7B7?logo=netlify)](https://mariappan.netlify.app/)
[![Built with Vite](https://img.shields.io/badge/built%20with-vite-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> A blazingly fast, SEO-optimized portfolio built with pure vibes, zero compromises. Powered by [Magic UI](https://magicui.design/), Tailwind CSS, and an unhealthy amount of caffeine.

**[View Live Site →](https://mariappan.netlify.app/)**

---

## ✨ What Makes This Special?

This isn't your average portfolio template. It's **fully vibe-coded** with a focus on:
- 🚀 **Performance** - Total gzipped bundle: ~360KB
- 🔍 **SEO** - Structured data, Open Graph, Twitter Cards, sitemap
- 🎭 **Aesthetics** - Magic UI components + Tailwind CSS v4
- ⚡ **Speed** - Vite build system, lazy loading, code splitting
- 🧩 **Simplicity** - Self-configured, no bloat, just vibes

---

## 🎯 Tech Stack

### Core
- **[React 18](https://react.dev/)** - With Suspense & lazy loading
- **[TypeScript](https://www.typescriptlang.org/)** - Strict mode enabled
- **[Vite](https://vitejs.dev/)** - Lightning-fast builds
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Latest version

### UI & Animation
- **[Magic UI](https://magicui.design/)** - Pre-built beautiful components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives (Accordion, ScrollArea)
- **[Framer Motion](https://www.framer.com/motion/)** - Buttery smooth animations
- **[Lucide React](https://lucide.dev/)** - Icon system
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode support

### SEO & Meta
- **[React Helmet Async](https://github.com/staylor/react-helmet-async)** - Dynamic meta tags
- **JSON-LD Structured Data** - Schema.org Person markup
- **Open Graph & Twitter Cards** - Social sharing optimization

---

## 🚀 Performance Optimizations

### 1. Smart Code Splitting
Strategic vendor chunking to maximize browser caching:

```javascript
// vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-helmet-async'],   // 329KB → 102KB gzipped
  'animation': ['framer-motion'],                                   // 137KB → 46KB gzipped
  'ui-vendor': ['@radix-ui/*'],                                     // 26KB → 8KB gzipped
  'icons': ['lucide-react'],                                        // 873KB → 161KB gzipped
}
```

**Result:** Heavy dependencies cached separately, main app code only 105KB (27KB gzipped)

### 2. Lazy Loading
Non-critical sections loaded on-demand:

```tsx
// App.tsx
const TalksSection = lazy(() => import("./components/sections/talks-section"))
const ArticlesSection = lazy(() => import("./components/sections/articles-section"))

<Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
  <TalksSection />
</Suspense>
```

### 3. Build Optimizations
- **esbuild minification** - Faster than Terser, excellent compression
- **Path aliases** - `@/` imports for cleaner code and better tree-shaking
- **ES2020 target** - Modern JS for smaller bundles
- **CSS purging** - Tailwind removes unused styles automatically

### 4. React Best Practices
- Conditional rendering based on breakpoints (avoid unnecessary DOM)
- Sticky positioning (CSS-only, no scroll listeners)
- Suspense boundaries for granular loading states
- No prop drilling - flat component structure

---

## 🔍 SEO Optimizations

### Comprehensive Meta Tags
- **Standard SEO** - Title, description, keywords, author, canonical URL
- **Open Graph** - Facebook/LinkedIn sharing with custom OG image
- **Twitter Cards** - Optimized for Twitter/X sharing
- **Theme colors** - For browser UI tinting (light/dark mode aware)

### Structured Data (JSON-LD)
```javascript
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mariappan Subramanian",
  "jobTitle": "Founding Engineer",
  "worksFor": { "@type": "Organization", "name": "Strivelabs" },
  // ... knowsAbout, alumniOf, sameAs links
}
```

Helps search engines understand:
- Who you are (Person entity)
- Your job & organization
- Skills & expertise
- Social profiles & alumni networks

### Static Assets
- `robots.txt` - Search engine directives
- `sitemap.xml` - URL discovery
- `og-image.png` - 1200x630 social sharing image
- `favicon.ico` - Browser tab icon

### Performance Hints
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

---

## 📦 Build Size Breakdown

```
dist/index.html                          1.20 kB │ gzip:   0.50 kB
dist/assets/index-[hash].css            42.66 kB │ gzip:   8.14 kB
dist/assets/talks-section-[hash].js     11.70 kB │ gzip:   2.22 kB
dist/assets/articles-section-[hash].js  14.47 kB │ gzip:   3.04 kB
dist/assets/ui-vendor-[hash].js         26.24 kB │ gzip:   8.61 kB
dist/assets/index-[hash].js            105.31 kB │ gzip:  27.64 kB
dist/assets/animation-[hash].js        137.37 kB │ gzip:  46.52 kB
dist/assets/react-vendor-[hash].js     329.27 kB │ gzip: 102.19 kB
dist/assets/icons-[hash].js            873.40 kB │ gzip: 161.72 kB
```

**Total:** ~1.5MB raw → **~360KB gzipped** 🎉

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ (or 20+ recommended)
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/mariappan-portfolio-v4.git
cd mariappan-portfolio-v4

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Project Structure

```
mariappan-portfolio-v4/
├── src/
│   ├── components/
│   │   ├── magicui/          # Magic UI components
│   │   ├── sections/         # Main content sections
│   │   ├── ui/               # Radix UI + custom components
│   │   ├── navbar.tsx
│   │   ├── profile-card.tsx
│   │   └── seo.tsx           # SEO component
│   ├── data/
│   │   ├── portfolio.ts      # Content data
│   │   └── seo.ts            # SEO config & structured data
│   ├── lib/
│   │   └── utils.ts          # Utility functions (cn, etc.)
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
├── vite.config.ts            # Build config with optimizations
└── tailwind.config.js
```

---

## 🎨 Customization

### 1. Update Content
Edit [src/data/portfolio.ts](src/data/portfolio.ts) with your information:
- Profile details
- Experience & projects
- Talks & articles
- Social links

### 2. Update SEO
Edit [src/data/seo.ts](src/data/seo.ts):
- Meta titles & descriptions
- Keywords & structured data
- Social handles
- Site URL

### 3. Customize Styling
All styling uses Tailwind CSS. Edit `tailwind.config.js` for:
- Color themes
- Typography
- Spacing scale
- Custom animations

### 4. Add/Remove Sections
Simply edit [src/App.tsx](src/App.tsx) - add/remove section components as needed.

---

## 🤝 Fork & Share

**Feel free to fork this repo and make it your own!**

If you create something cool, I'd love to see it:
- 🐦 Tag me on Twitter/X: [@mariapp62431572](https://x.com/mariapp62431572)
- 💼 Connect on LinkedIn: [marigameo](https://www.linkedin.com/in/marigameo/)
- 📧 Or drop me an email (check the portfolio for contact info)

I appreciate creativity and would be stoked to see your unique spin on this design.

---

## 📝 License

MIT License - Use it however you want. Credit appreciated but not required.

---

## 🙏 Credits

- **[Magic UI](https://magicui.design/)** - For the beautiful component library
- **[Radix UI](https://www.radix-ui.com/)** - For accessible primitives
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - For the blazingly fast build tool
- **You** - For checking out this repo!

---

<div align="center">

**Crafted with care (and caffeine) in India 🇮🇳**

[View Live](https://mariappan.netlify.app/) • [Report Bug](https://github.com/Marigameo/mariappan-portfolio-2026/issues) • [Request Feature](https://github.com/Marigameo/mariappan-portfolio-2026/issues)

</div>

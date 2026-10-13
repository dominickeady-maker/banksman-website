# banksman-website

The banksman.app marketing site and blog: [Astro](https://astro.build) static site, [Decap CMS](https://decapcms.org) at `/admin/`, deployed on Netlify.

```bash
npm install
npm run dev     # http://localhost:4321 (drafts visible)
npm run check   # content checks, type checks, production build, build checks
```

| Path | What it is |
|---|---|
| `src/pages/` | Home, privacy, 404, blog index, posts, RSS feed, share images (`/og/*.png`) |
| `src/content/blog/` | Blog posts (Markdown) |
| `src/components/`, `src/layouts/` | Header, footer, SEO tags, page and post layouts |
| `src/site.ts` | Site name, URL, demo link, phone and email |
| `public/assets/` | Site CSS/JS, fonts, logos and cookie consent, carried over from the old static site |
| `public/thanks.html` | Demo logins page the home-page form posts to (kept as a static file) |
| `public/admin/` | Decap CMS (GitHub backend) |
| `scripts/` | `check-content.mjs` and `check-dist.mjs` |

Writing and publishing posts: [BLOG_GUIDE.md](BLOG_GUIDE.md). Starting point for a new post: [BLOG_TEMPLATE.md](BLOG_TEMPLATE.md).

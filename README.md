# banksman-website

The banksman.app marketing site and blog: [Astro](https://astro.build) static site, [Decap CMS](https://decapcms.org) at `/admin/`, deployed on Netlify.

```bash
npm install
npm run dev     # http://localhost:4321 (drafts visible)
npm run check   # content checks, type checks, production build, build checks
```

| Path | What it is |
|---|---|
| `src/pages/` | Home, privacy, blog index, posts, RSS feed, share images |
| `src/content/blog/` | Blog posts (Markdown) |
| `src/site.ts` | Site name, URL and demo URL |
| `public/admin/` | Decap CMS (GitHub backend) |
| `scripts/` | `check-content.mjs` and `check-dist.mjs` |

Writing and publishing posts: [BLOG_GUIDE.md](BLOG_GUIDE.md). Starting point for a new post: [BLOG_TEMPLATE.md](BLOG_TEMPLATE.md).

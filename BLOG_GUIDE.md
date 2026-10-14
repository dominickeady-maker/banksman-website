# Banksman blog guide

How to write, check and publish posts on banksman.app/blog/.

## How it fits together

- Posts are Markdown files in `src/content/blog/`. The file name is the URL: `daywork-vs-price-work.md` → `/blog/daywork-vs-price-work/`.
- Netlify rebuilds the site whenever `main` changes. Nothing reaches the live site any other way.
- A post with `draft: true` is never built for the live site. It doesn't appear on the blog page, in the sitemap or in the RSS feed, and it gets no share image. Drafts show up in `npm run dev` with a yellow "Draft" label so you can proof them.
- Each live post automatically gets:
  - a 1200×630 share image at `/og/<slug>.png`;
  - an entry in `/sitemap-index.xml` and `/rss.xml`;
  - Google structured data for the article, its breadcrumb trail and its FAQ.

## Writing a post

Start from [`BLOG_TEMPLATE.md`](BLOG_TEMPLATE.md), or click **New Blog post** in `/admin/`.

**Front matter**

| Field | Rule |
|---|---|
| `title` | 10–90 characters. It becomes the page's only H1, so don't repeat it as a `#` heading in the body. |
| `description` | 50–160 characters. Shown in Google results and link previews. |
| `keyword` | The search phrase the post targets. Use it in the title or the first paragraph. |
| `author` | The writer's name, e.g. `Matt`. |
| `category` | Shown above the title and on the blog card. Defaults to `Site management`. |
| `pubDate` / `updatedDate` | `YYYY-MM-DD`. Set `pubDate` to the day it goes live. Add `updatedDate` when you change a live post materially. |
| `draft` | `true` while writing. Set it to `false` to publish. |
| `faq` | Two to four question/answer pairs. They render at the end of the post and feed Google's FAQ data. Don't also write a `## FAQ` section in the body. |
| `image`, `imageAlt` | Optional. A custom 1200×630 share image; leave empty to use the generated one. |

**House rules.** `npm run check` enforces the first five.

1. **No `#` heading in the body.** Start with a direct-answer paragraph, then `##` sections.
2. **Every price says "+ VAT"**, straight after the figure: `£79/month + VAT`, `£10–£30 per user + VAT`.
3. **Link the demo as `/#demo`**, never a bare `#demo`, which only works on the home page. `/#demo` is the four-field form that unlocks the logins. It's set in `src/site.ts`.
4. **Describe the demo as "realistic sample data"**, not "real (fictional) data".
5. **Drawings:** Banksman puts drawings on every phone, labelled by version. It does not do revision control, superseding or comparison, so don't claim it does, or imply it ("the current revision on every phone", "there is only one"). This applies to the site pages too.
6. **Claims about other products**, such as prices, tiers, free plans and how onboarding works, change often. Check each one on the vendor's own site the week you publish, and keep wording general ("per-user pricing") rather than quoting their figures.
7. **Compliance and legal points:** say what's generally true and tell the reader to check their own contract, client or insurer. Don't promise that something is "valid" or "compliant".
8. Internal links use the path with a trailing slash: `[daywork vs price work](/blog/daywork-vs-price-work/)`.
9. File names are lowercase words joined by hyphens. Don't rename a live post's file, because that changes its URL.

## Publishing through /admin/

1. Go to `https://banksman.app/admin/` and log in with GitHub. You need write access to `dominickeady-maker/banksman-website`.
2. **New Blog post**, or open an existing one. Use **Save** as often as you like. Each post is held as its own pull request on GitHub and doesn't touch the live site.
3. On the **Workflow** tab, move the card from *Drafts* → *In review* → *Ready*.
   - Every saved change gets a Netlify deploy preview on its pull request, so you can see it before it goes live.
   - Drafts are hidden in previews too. Untick **Draft** to see the finished page there.
4. To go live, untick **Draft**, set **Publish date**, save, then click **Publish** on the Workflow tab. That merges the post into `main`, and Netlify rebuilds in a minute or two.

Images you upload go into `public/images/blog/` and are served from `/images/blog/`.

## Publishing through Git

```bash
npm install
npm run dev            # http://localhost:4321, drafts included
npm run check          # all checks + production build
```

Commit to a branch, open a pull request, and check the Netlify preview before merging.

## Checks

`npm run check` runs four steps, and stops at the first one that fails:

1. **`check:content`** checks the source:
   - front matter is complete;
   - no H1 or `## FAQ` in the body;
   - every price has "+ VAT";
   - no bare `#demo` link;
   - no "(fictional)", and no revision-control claims in posts or pages;
   - internal blog links point at real posts;
   - the old company name appears nowhere in the repo.

   It also warns when a description runs over 160 characters or the keyword is missing from the title and first paragraph.
2. **`check:types`** runs `astro check` and validates front matter against the schema in `src/content.config.ts`.
3. **`build`** produces the production site in `dist/`.
4. **`check:dist`** checks the built site:
   - every page has one H1, a title, a meta description, a correct canonical and a share image that exists;
   - all JSON-LD parses;
   - every internal link, `#anchor` and asset resolves;
   - the home page still has the `demo-access` Netlify form, posting to `/thanks.html`;
   - drafts aren't built and aren't in the sitemap or RSS;
   - `/admin/`, `robots.txt` and the sitemap are present;
   - the old company name appears nowhere.

## Admin login setup (one-off, already done if /admin/ works)

Decap uses the GitHub backend. Netlify handles the GitHub login:

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Homepage URL: `https://banksman.app`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Copy the Client ID and generate a Client secret.
3. In Netlify, go to **Site configuration → Access & security → OAuth → Authentication providers → Install provider → GitHub** and paste both.

Anyone who logs in needs write access to the repository.

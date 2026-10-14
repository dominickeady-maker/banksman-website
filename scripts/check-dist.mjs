// Checks the production build in dist/. Runs after `npm run build`: `npm run check:dist`.
import { readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { BANNED, walk, report, isText } from './lib.mjs';

const root = process.cwd();
const dist = join(root, 'dist');
const SITE = 'https://banksman.app';
const errors = [];
const warnings = [];

if (!existsSync(dist)) report('Build output', ['dist/ not found; run `npm run build` first']);

const files = walk(dist);
const rel = (p) => relative(dist, p);
const read = (p) => readFileSync(p, 'utf8');

// Map a site path or absolute banksman.app URL to a file in dist.
function resolve(href) {
  let path = href.startsWith(SITE) ? href.slice(SITE.length) : href;
  path = decodeURI(path.split(/[?#]/)[0]);
  if (!path.startsWith('/')) return null;
  const candidates = path.endsWith('/') ? [join(dist, path, 'index.html')] : [join(dist, path), join(dist, path, 'index.html')];
  return candidates.find(existsSync) ?? false;
}

// Which posts are drafts, read straight from source.
const blogDir = join(root, 'src/content/blog');
const drafts = walk(blogDir)
  .filter((p) => p.endsWith('.md') && /^draft:\s*true\s*$/m.test(read(p)))
  .map((p) => p.slice(blogDir.length + 1, -3));

for (const file of files.filter(isText)) {
  const text = read(file);
  for (const word of BANNED) if (text.toLowerCase().includes(word.toLowerCase())) errors.push(`${rel(file)}: contains "${word}"`);
  if (text.includes('DEMO_URL_PENDING')) errors.push(`${rel(file)}: demo URL placeholder`);
  if (/href="#demo"/.test(text) && !/id="demo"/.test(text)) errors.push(`${rel(file)}: links to #demo but has no #demo section`);
}

const pages = files.filter((p) => p.endsWith('.html') && !rel(p).startsWith('admin/'));
for (const file of pages) {
  const name = rel(file);
  const html = read(file);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) errors.push(`${name}: has ${h1s} <h1> elements, expected 1`);
  if (!/<title>[^<]{5,}<\/title>/.test(html)) errors.push(`${name}: missing <title>`);
  // Pages kept out of search (404, thanks) don't need search metadata.
  const indexable = !/<meta name="robots" content="noindex/.test(html);
  if (indexable && !/<meta name="description" content="[^"]{50,}"/.test(html)) errors.push(`${name}: missing or short meta description`);
  if (indexable) {
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (!canonical) errors.push(`${name}: missing canonical`);
    else if (canonical !== `${SITE}/${name.replace(/index\.html$/, '')}`) errors.push(`${name}: canonical is ${canonical}`);
  }
  const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (!og) { if (indexable) errors.push(`${name}: missing og:image`); }
  else if (!resolve(og)) errors.push(`${name}: og:image ${og} is not in the build`);

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch { errors.push(`${name}: invalid JSON-LD`); }
  }

  for (const [, attr, href] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (href.startsWith('#') && href.length > 1 && !html.includes(`id="${href.slice(1)}"`)) errors.push(`${name}: ${href} points at a missing anchor`);
    if (/^(mailto:|tel:|#|data:|javascript:)/.test(href)) continue;
    if (/^https?:/.test(href) && !href.startsWith(SITE)) continue;
    if (href.startsWith('//')) continue;
    const target = resolve(href);
    if (target === false) errors.push(`${name}: broken ${attr} ${href}`);
    else if (target && href.includes('#')) {
      const id = href.split('#')[1];
      if (id && !read(target).includes(`id="${id}"`)) errors.push(`${name}: ${href} points at a missing #${id}`);
    }
  }
}

// Drafts must not be built, listed, or announced.
for (const slug of drafts) {
  if (existsSync(join(dist, 'blog', slug))) errors.push(`draft "${slug}" was built`);
  if (existsSync(join(dist, 'og', `${slug}.png`))) errors.push(`draft "${slug}" has a share image`);
}
const sitemaps = files.filter((p) => /sitemap.*\.xml$/.test(p)).map(read).join('\n');
if (!sitemaps) errors.push('sitemap is missing');
if (/\/admin\//.test(sitemaps)) errors.push('sitemap lists /admin/');
for (const slug of drafts) if (sitemaps.includes(`/blog/${slug}/`)) errors.push(`sitemap lists draft "${slug}"`);
for (const url of sitemaps.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (url[1].endsWith('.xml')) continue;
  if (!resolve(url[1])) errors.push(`sitemap lists ${url[1]}, which is not in the build`);
}

const rssPath = join(dist, 'rss.xml');
if (!existsSync(rssPath)) errors.push('rss.xml is missing');
else {
  const rss = read(rssPath);
  for (const slug of drafts) if (rss.includes(`/blog/${slug}/`)) errors.push(`rss.xml lists draft "${slug}"`);
  for (const [, link] of rss.matchAll(/<link>([^<]+)<\/link>/g)) if (!resolve(link) && link !== `${SITE}/`) errors.push(`rss.xml links ${link}, which is not in the build`);
}

for (const required of ['admin/index.html', 'admin/config.yml', 'robots.txt', 'og/default.png', 'og/blog.png', '404.html', 'thanks.html', 'assets/site.css']) {
  if (!existsSync(join(dist, required))) errors.push(`${required} is missing`);
}

// The demo form is how people get demo logins; Netlify only picks it up if it's in the built HTML.
const home = existsSync(join(dist, 'index.html')) ? read(join(dist, 'index.html')) : '';
if (!/<form[^>]*name="demo-access"[^>]*data-netlify="true"/.test(home)) errors.push('index.html: demo-access Netlify form is missing');
if (!/action="\/thanks\.html"/.test(home)) errors.push('index.html: demo form no longer posts to /thanks.html');

const robots = existsSync(join(dist, 'robots.txt')) ? read(join(dist, 'robots.txt')) : '';
if (!robots.includes(`${SITE}/sitemap-index.xml`)) errors.push('robots.txt does not point at the sitemap');

report(`Build (${pages.length} pages, ${drafts.length} drafts held back)`, errors, warnings);

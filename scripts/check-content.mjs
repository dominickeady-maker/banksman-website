// Source checks for blog posts and the repo. Runs before the build: `npm run check:content`.
import { readFileSync, existsSync } from 'node:fs';
import { join, basename, relative } from 'node:path';
import { BANNED, walk, report, isText } from './lib.mjs';

const root = process.cwd();
const blogDir = join(root, 'src/content/blog');
const errors = [];
const warnings = [];

// Slugs used by other routes under /og/ (site pages, tools, compare, and the for-<trade> landing pages).
const RESERVED = new Set(['default', 'blog', 'tools', 'tools-cis-calculator', 'tools-day-rate-calculator', 'compare']);
const isReserved = (slug) => RESERVED.has(slug) || slug.startsWith('for-');

// Banksman labels drawings by version; it has no revision history or superseding, so pages
// and posts must not claim it does. The keyword field may still target the search phrase.
const DRAWING_CLAIM = /revision control|version control|(?:latest|current) (?:drawing )?revision (?:is )?on every phone|(?:latest|current) drawing on every phone|latest revision on every phone|because there is only one|only one anyone can find/i;

// A price is £ + digits, optionally a range and a unit; it must be followed by "+ VAT".
const PRICE = /£\d[\d,.]*k?(?:\s?[–-]\s?£\d[\d,.]*k?)?(?:\/\w+|\s(?:a|per)\s(?:month|year|user|seat|week|day))?/g;

const posts = walk(blogDir).filter((p) => p.endsWith('.md'));
const slugs = new Set(posts.map((p) => basename(p, '.md')));

for (const file of posts) {
  const rel = relative(root, file);
  const slug = basename(file, '.md');
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { errors.push(`${rel}: missing front matter`); continue; }
  const [, fm, body] = m;
  const field = (name) => fm.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'))?.[1]?.replace(/^"(.*)"$/, '$1').trim();

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push(`${rel}: file name must be a lowercase-hyphen slug`);
  if (isReserved(slug)) errors.push(`${rel}: "${slug}" is reserved`);
  for (const name of ['title', 'description', 'keyword', 'author', 'pubDate']) {
    if (!field(name)) errors.push(`${rel}: front matter "${name}" is missing`);
  }
  if (!/^draft:\s*(true|false)\s*$/m.test(fm)) errors.push(`${rel}: front matter "draft" must be true or false`);

  const desc = field('description') ?? '';
  if (desc.length > 160) warnings.push(`${rel}: description is ${desc.length} characters; Google shows about 155`);

  const keyword = (field('keyword') ?? '').toLowerCase();
  const firstPara = body.trim().split(/\n\s*\n/)[0].toLowerCase();
  const title = (field('title') ?? '').toLowerCase();
  const words = keyword.split(/\s+/).filter((w) => w.length > 3);
  const covered = words.filter((w) => title.includes(w) || firstPara.includes(w)).length;
  if (words.length && covered / words.length < 0.5) warnings.push(`${rel}: keyword "${keyword}" barely appears in the title or first paragraph`);

  // Body rules.
  const prose = body.replace(/```[\s\S]*?```/g, '');
  if (/^#\s/m.test(prose)) errors.push(`${rel}: body has a "# " heading; the title is already the page H1`);
  if (/^##\s+FAQ\s*$/im.test(prose)) errors.push(`${rel}: FAQ belongs in the "faq" front matter, not the body`);
  // A bare #demo only works on the home page; posts must link /#demo (the demo form).
  if (/\]\(#demo\)|href="#demo"/.test(prose) || text.includes('DEMO_URL_PENDING')) errors.push(`${rel}: demo link must be /#demo, not #demo or a placeholder`);
  if (/\(fictional\)/i.test(text)) errors.push(`${rel}: say "realistic sample data", not "(fictional)"`);
  const claim = prose.match(DRAWING_CLAIM) ?? fm.match(/^(?:title|description):.*?(revision control|version control)/im);
  if (claim) errors.push(`${rel}: "${claim[0].trim()}" claims revision control; say "drawings on every phone, labelled by version"`);

  for (const line of text.split('\n')) {
    for (const match of line.matchAll(PRICE)) {
      const after = line.slice(match.index + match[0].length);
      if (!/^\s?\+\s?VAT/.test(after)) errors.push(`${rel}: price "${match[0]}" needs "+ VAT" straight after it`);
    }
  }

  // Internal blog links must point at a post that exists.
  for (const [, target] of text.matchAll(/\]\((\/blog\/[^)#\s]*)\)/g)) {
    const linked = target.replace(/^\/blog\/|\/$/g, '');
    if (linked && !slugs.has(linked)) errors.push(`${rel}: links to ${target}, which is not a post`);
    if (!target.endsWith('/')) errors.push(`${rel}: internal link ${target} needs a trailing slash`);
  }
}

// Repo-wide: banned names must not appear in any tracked source.
const skip = new Set(['node_modules', '.git', 'dist', '.astro', 'package-lock.json']);
for (const file of walk(root, skip).filter(isText)) {
  const text = readFileSync(file, 'utf8');
  for (const word of BANNED) {
    if (text.toLowerCase().includes(word.toLowerCase())) errors.push(`${relative(root, file)}: contains "${word}"`);
  }
}

// The same drawing rule for site pages.
for (const file of walk(join(root, 'src/pages')).filter((p) => p.endsWith('.astro'))) {
  const claim = readFileSync(file, 'utf8').match(DRAWING_CLAIM);
  if (claim) errors.push(`${relative(root, file)}: "${claim[0]}" claims revision control; say "drawings on every phone, labelled by version"`);
}

if (!existsSync(join(root, 'public/admin/config.yml'))) errors.push('public/admin/config.yml is missing');

report(`Content (${posts.length} posts)`, errors, warnings);

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Built from parts so this file never matches its own search.
export const BANNED = [['Corner', 'stone'].join('')];

export function walk(dir, skip = new Set()) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path, skip));
    else out.push(path);
  }
  return out;
}

export function report(label, errors, warnings = []) {
  for (const w of warnings) console.warn(`  warn  ${w}`);
  for (const e of errors) console.error(`  FAIL  ${e}`);
  if (errors.length) {
    console.error(`\n${label}: ${errors.length} problem(s).`);
    process.exit(1);
  }
  console.log(`${label}: OK${warnings.length ? ` (${warnings.length} warning(s))` : ''}`);
}

const TEXT = /\.(astro|md|mdx|ts|mjs|js|json|yml|yaml|toml|html|css|svg|xml|txt)$/i;
export const isText = (path) => TEXT.test(path);

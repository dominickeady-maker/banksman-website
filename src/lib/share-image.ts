import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
// satori reads woff/ttf, not woff2, so share images use the npm copies of the site fonts.
const font = (pkg: string, file: string) => readFile(require.resolve(`@fontsource/${pkg}/files/${file}`));

type Font = { name: string; data: Buffer; weight: 400 | 500 | 800; style: 'normal' };
let assets: Promise<{ fonts: Font[]; logo: string }> | undefined;
function loadAssets() {
  assets ??= (async () => ({
    fonts: [
      { name: 'Big Shoulders Display', data: await font('big-shoulders-display', 'big-shoulders-display-latin-800-normal.woff'), weight: 800, style: 'normal' },
      { name: 'IBM Plex Sans', data: await font('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff'), weight: 400, style: 'normal' },
      { name: 'IBM Plex Sans', data: await font('ibm-plex-sans', 'ibm-plex-sans-latin-500-normal.woff'), weight: 500, style: 'normal' },
    ],
    logo: `data:image/png;base64,${(await readFile('public/assets/banksman-logo.png')).toString('base64')}`,
  }))();
  return assets;
}

// Brand colours from /assets/site.css.
const BRAND = { bg: '#0d1120', ink: '#f5f3ec', muted: '#8890a8', accent: '#ff7a2e', line: 'rgba(245,243,236,0.10)' };

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, props: Record<string, unknown>, children?: unknown): Node => ({ type, props: { ...props, children } });

/** Renders a 1200×630 PNG share card. */
export async function renderShareImage({ title, eyebrow }: { title: string; eyebrow: string }): Promise<Uint8Array> {
  const { fonts, logo } = await loadAssets();
  const size = title.length > 70 ? 66 : title.length > 45 ? 78 : 92;
  const tree = h(
    'div',
    {
      style: {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '64px 76px', color: BRAND.ink, fontFamily: 'IBM Plex Sans',
        backgroundColor: BRAND.bg,
        backgroundImage: 'radial-gradient(circle at 88% 0%, rgba(255,122,46,0.30), rgba(255,122,46,0) 55%)',
        borderBottom: `10px solid ${BRAND.accent}`,
      },
    },
    [
      h('img', { src: logo, width: 324, height: 52.5 }),
      h('div', { style: { display: 'flex', flexDirection: 'column' } }, [
        h('div', { style: { display: 'flex', fontSize: 24, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.accent, marginBottom: 18 } }, eyebrow),
        h('div', { style: { display: 'flex', fontFamily: 'Big Shoulders Display', fontWeight: 800, fontSize: size, lineHeight: 1.0, textTransform: 'uppercase' } }, title),
      ]),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 26, color: BRAND.muted, borderTop: `1px solid ${BRAND.line}`, paddingTop: 22 } }, [
        h('div', { style: { display: 'flex' } }, 'Site management software built by a working builder'),
        h('div', { style: { display: 'flex', color: BRAND.ink, fontWeight: 500 } }, 'banksman.app'),
      ]),
    ],
  );
  // satori accepts plain element objects in place of JSX.
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

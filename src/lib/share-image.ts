import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const fontPath = (weight: number) => require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`);

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 800; style: 'normal' }[]> | undefined;
function loadFonts() {
  fonts ??= Promise.all([
    readFile(fontPath(400)).then((data) => ({ name: 'Inter', data, weight: 400 as const, style: 'normal' as const })),
    readFile(fontPath(800)).then((data) => ({ name: 'Inter', data, weight: 800 as const, style: 'normal' as const })),
  ]);
  return fonts;
}

// Brand colours for share images. Keep in step with src/styles/global.css.
const BRAND = { bg: '#14181d', fg: '#ffffff', muted: '#aab4bf', accent: '#f59e0b' };

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

/** Renders a 1200×630 PNG share card. */
export async function renderShareImage({ title, eyebrow }: { title: string; eyebrow: string }): Promise<Uint8Array> {
  const size = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;
  const tree = h(
    'div',
    { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', background: BRAND.bg, color: BRAND.fg, fontFamily: 'Inter' },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: '18px', fontSize: 34, fontWeight: 800 }, [
        h('div', { width: 44, height: 44, borderRadius: 8, background: BRAND.accent }),
        'Banksman',
      ]),
      h('div', { display: 'flex', fontSize: size, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em' }, title),
      h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 28, color: BRAND.muted }, [
        h('div', { display: 'flex' }, eyebrow),
        h('div', { display: 'flex', color: BRAND.accent }, 'banksman.app'),
      ]),
    ],
  );
  // satori accepts plain element objects in place of JSX.
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

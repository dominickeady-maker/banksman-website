import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts } from '../../lib/posts';
import { renderShareImage } from '../../lib/share-image';

const pages = [
  { slug: 'default', title: 'Kill the paperwork. And the WhatsApp.', eyebrow: 'Site management software' },
  { slug: 'blog', title: 'From the site, not the sales team.', eyebrow: 'The Banksman blog' },
];

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return [
    ...pages.map(({ slug, title, eyebrow }) => ({ params: { slug }, props: { title, eyebrow } })),
    ...posts.map((post) => ({ params: { slug: post.id }, props: { title: post.data.title, eyebrow: post.data.category } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderShareImage(props as { title: string; eyebrow: string });
  return new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
};

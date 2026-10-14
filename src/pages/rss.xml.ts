import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site';
import { getPosts, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((post) => !post.data.draft);
  return rss({
    title: `${SITE.name} blog`,
    description: 'Practical writing on running building sites: tasks, timesheets, materials, drawings and getting off WhatsApp.',
    site: context.site ?? SITE.url,
    trailingSlash: true,
    customData: '<language>en-gb</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  });
}

import { SITE } from '../site';
import type { Post } from './posts';
import { postUrl, shareImageUrl } from './posts';

const abs = (path: string) => new URL(path, SITE.url).href;

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: abs('/assets/icon-512.png'),
};

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, publisher: { '@id': organization['@id'] } },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: abs(item.path) })),
  };
}

export function blogPostingSchema(post: Post) {
  const { title, description, pubDate, updatedDate, author, keyword } = post.data;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    keywords: keyword,
    image: abs(shareImageUrl(post)),
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    author: author === SITE.name ? { '@id': organization['@id'] } : { '@type': 'Person', name: author },
    publisher: organization,
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(postUrl(post)) },
    inLanguage: 'en-GB',
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

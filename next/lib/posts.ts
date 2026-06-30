import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

const postsDir = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  dateFormatted: string;
  categories: string[];
  excerpt: string;
  comments: boolean;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getAllPostMeta(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const posts = files.map(filename => {
    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
    const { data, content } = matter(raw);
    const slug = slugFromFilename(filename);
    const excerpt = content.replace(/^---[\s\S]*?---\s*/m, '').trim().slice(0, 200).replace(/[#*`\[\]]/g, '') + '...';
    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date).slice(0, 10) : filename.slice(0, 10),
      dateFormatted: formatDate(data.date ? String(data.date) : filename.slice(0, 10)),
      categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : []),
      excerpt,
      comments: !!data.comments,
    };
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const filename = slug + '.md';
  const filepath = path.join(postsDir, filename);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, 'utf8');
  const { data, content } = matter(raw);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  // wrap <pre><code> blocks in <div class="highlight">
  let html = String(processed);
  html = html.replace(/<pre>/g, '<div class="highlight"><div class="code-header"><button class="copy-btn">Copy</button></div><pre>');
  html = html.replace(/<\/pre>/g, '</pre></div>');

  return {
    slug,
    title: data.title || slug,
    date: data.date ? String(data.date).slice(0, 10) : filename.slice(0, 10),
    dateFormatted: formatDate(data.date ? String(data.date) : filename.slice(0, 10)),
    categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : []),
    excerpt: content.trim().slice(0, 200),
    comments: !!data.comments,
    contentHtml: html,
  };
}

export function getAllCategories(): Record<string, PostMeta[]> {
  const posts = getAllPostMeta();
  const cats: Record<string, PostMeta[]> = {};
  for (const post of posts) {
    for (const cat of post.categories) {
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(post);
    }
  }
  return cats;
}

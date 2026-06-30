import { notFound } from 'next/navigation';
import Link from 'next/link';
import DescriptionLayout from '@/components/DescriptionLayout';
import Comments from '@/components/Comments';
import CopyButtonInit from '@/components/CopyButtonInit';
import { getPost, getAllPostMeta } from '@/lib/posts';

export async function generateStaticParams() {
  return getAllPostMeta().map(p => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <DescriptionLayout>
      <h2>{post.title}</h2>
      <small>{post.dateFormatted}</small>

      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <CopyButtonInit />

      <div className="post-footer">
        <div className="post-categories">
          Categories:{' '}
          {post.categories.map((cat, i) => (
            <span key={cat}>
              <Link href={`/categories#${cat}`}>{cat}</Link>
              {i < post.categories.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>
      </div>

      {post.comments && <Comments postId={`/blog/${post.slug}/`} />}
    </DescriptionLayout>
  );
}

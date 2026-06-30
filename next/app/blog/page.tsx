import Link from 'next/link';
import DescriptionLayout from '@/components/DescriptionLayout';
import { getAllPostMeta, getAllCategories } from '@/lib/posts';

const PER_PAGE = 10;

export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const allPosts = getAllPostMeta();
  const categories = getAllCategories();
  const totalPages = Math.ceil(allPosts.length / PER_PAGE);
  const posts = allPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <DescriptionLayout>
      {allPosts.length === 0 ? (
        <p>No posts right now.</p>
      ) : (
        <>
          <div className="blogPage-categoryList">
            <ul>
              <li><Link href="/categories">Categories</Link> : </li>
              {Object.keys(categories).map(cat => (
                <li key={cat}>
                  <Link href={`/categories#${cat}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <ul className="blog-list">
            {posts.map(post => (
              <li key={post.slug}>
                <Link className="blog-heading" href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
                <span className="date">{post.dateFormatted}</span>
                <div className="excerpt">{post.excerpt}</div>
              </li>
            ))}
          </ul>

          <hr />

          {totalPages > 1 && (
            <ul>
              {page > 1 && (
                <li>
                  <Link href={`/blog?page=${page - 1}`}>Newer</Link>
                </li>
              )}
              {page < totalPages && (
                <li>
                  <Link href={`/blog?page=${page + 1}`}>Older</Link>
                </li>
              )}
            </ul>
          )}
        </>
      )}
    </DescriptionLayout>
  );
}

import Link from 'next/link';
import DescriptionLayout from '@/components/DescriptionLayout';
import { getAllCategories } from '@/lib/posts';

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <DescriptionLayout>
      <div id="archives">
        {Object.entries(categories).map(([cat, posts]) => (
          <div key={cat} className="archive-group">
            <div id={cat} />
            <h3 className="category-head">{cat}</h3>
            <a id={cat} />
            {posts.map(post => (
              <article key={post.slug} className="archive-item">
                &nbsp;&nbsp;
                <Link href={`/blog/${post.slug}`}>
                  {post.title} - {post.dateFormatted}
                </Link>
              </article>
            ))}
            <br />
          </div>
        ))}
      </div>
    </DescriptionLayout>
  );
}

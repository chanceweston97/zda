import BlogItem from '@/components/Blog/BlogItem';
import Breadcrumb from '@/components/Common/Breadcrumb';
import {
  getCategoryBySlug,
  getPostCategories,
  getPostsByCategoryOrTag,
} from '@/sanity/sanity-blog-utils';
import { imageBuilder } from '@/sanity/sanity-shop-utils';

export async function generateStaticParams() {
  try {
    const categories = await getPostCategories();
    if (!Array.isArray(categories)) {
      return [];
    }
    return categories
      .filter((category) => category?.slug?.current)
      .map((category) => ({
        slug: category.slug.current,
      }));
  } catch (error) {
    console.error('Error generating static params for blog categories:', error);
    return [];
  }
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const BlogGrid = async ({ params }: PageProps) => {
  let blogData = [];
  let category = null;

  try {
    const { slug } = await params;
    if (slug) {
      [blogData, category] = await Promise.all([
        getPostsByCategoryOrTag(slug),
        getCategoryBySlug(slug),
      ]);
      if (!Array.isArray(blogData)) {
        blogData = [];
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    blogData = [];
  }

  // Build image URLs for all blogs on the server side
  // Only include serializable properties to avoid serialization errors
  const blogsWithImageUrls = blogData.map((blog) => {
    let mainImageUrl = '/no image';
    if (blog?.mainImage) {
      try {
        const imageUrl = imageBuilder(blog.mainImage).url();
        if (imageUrl) {
          mainImageUrl = imageUrl;
        }
      } catch (error) {
        console.error('Error building blog image URL:', error);
      }
    }
    // Return only serializable properties that are actually needed
    // Avoid including complex objects like body (PortableText), author (references), etc.
    return {
      _id: blog._id,
      title: blog.title || '',
      slug: blog.slug ? {
        current: blog.slug.current || '',
      } : { current: '' },
      category: blog.category || '',
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      publishedAt: blog.publishedAt || '',
      mainImageUrl,
    };
  });

  return (
    <>
      <Breadcrumb
        title={category ? category?.title : 'Blog Category'}
        pages={['category']}
      />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {blogsWithImageUrls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-7.5">
              {blogsWithImageUrls.map((blog) => (
                <BlogItem blog={blog} key={blog._id} mainImageUrl={blog.mainImageUrl} />
              ))}
            </div>
          ) : (
            <p className="text-center text-xl">No posts found!</p>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogGrid;

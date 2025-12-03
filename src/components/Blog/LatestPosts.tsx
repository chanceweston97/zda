import { getPostsByLimit } from '@/sanity/sanity-blog-utils';
import { imageBuilder } from '@/sanity/sanity-shop-utils';
import type { Blog } from '@/types/blogItem';
import Image from 'next/image';
import Link from 'next/link';

type PropsType = {
  data?: (Blog & { mainImageUrl?: string })[];
};

export default async function LatestPosts({ data }: PropsType) {
  let postsData: (Blog & { mainImageUrl?: string })[] = [];
  
  if (!data) {
    try {
      const fetchedData = await getPostsByLimit(3);
      if (Array.isArray(fetchedData)) {
        // Build image URLs for fetched data
        // Only include serializable properties to avoid serialization errors
        postsData = fetchedData.map((blog) => {
          let mainImageUrl = '';
          if (blog?.mainImage) {
            try {
              const imageUrl = imageBuilder(blog.mainImage).url();
              if (imageUrl) {
                mainImageUrl = imageUrl;
              }
            } catch (error) {
              console.error('Error building blog image URL in LatestPosts:', error);
            }
          }
          // Return only serializable properties that are actually needed
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
      }
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      postsData = [];
    }
  } else {
    postsData = data;
  }

  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Recent Posts</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {/* <!-- post item --> */}
          {postsData.length > 0 ? (
            postsData.slice(0, 3).map((blog) => {
              const blogSlug = blog.slug?.current || '';
              const blogTitle = blog.title || '';
              const imageUrl = blog.mainImageUrl || (blog.mainImage ? '' : '');
              
              return (
                <div className="flex items-center gap-4" key={blog._id}>
                  {blogSlug && (
                    <Link
                      href={`/blogs/${blogSlug}`}
                      className="max-w-[110px] w-full rounded-[10px] overflow-hidden"
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={blogTitle || 'blog'}
                          className="rounded-[10px] w-full h-20 object-cover"
                          width={110}
                          height={80}
                        />
                      ) : (
                        <div className="rounded-[10px] w-full h-20 bg-gray-3" />
                      )}
                    </Link>
                  )}

                  {blogSlug && blogTitle && (
                    <Link href={`/blogs/${blogSlug}`}>
                      <h3 className="text-dark leading-[22px] ease-out duration-200 mb-1.5 hover:text-blue">
                        {blogTitle.length > 40
                          ? blogTitle.slice(0, 40) + '...'
                          : blogTitle}
                      </h3>

                      {blog.publishedAt && (
                        <div className="flex items-center gap-3">
                          <div className="text-custom-xs ease-out duration-200">
                            {new Date(blog.publishedAt)
                              .toDateString()
                              .split(' ')
                              .slice(1)
                              .join(' ')}
                          </div>

                          {/* <!-- divider --> */}
                          <div className="block w-px h-4 bg-gray-4"></div>

                          <div className="text-custom-xs ease-out duration-200">
                            100k Views
                          </div>
                        </div>
                      )}
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No recent posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

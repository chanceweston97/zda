import BlogDetailsWithSidebar from '@/components/BlogDetailsWithSidebar';
import { getPost } from '@/sanity/sanity-blog-utils';
import { imageBuilder } from '@/sanity/sanity-shop-utils';
import { Metadata } from 'next';

// Disable static generation - use dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog Details Page | ZDAComm |  Store',
  description: 'This is Blog Details Page for ZDAComm Template',
  // other metadata
};

const BlogDetailsWithSidebarPage = async () => {
  try {
    const slug = 'cooking-masterclass-creating-delicious-italian-pasta';

    const blogData = await getPost(slug);

    // Build image URL on the server side
    let mainImageUrl = '';
    if (blogData?.mainImage) {
      try {
        const imageUrl = imageBuilder(blogData.mainImage).url();
        if (imageUrl) {
          mainImageUrl = imageUrl;
        }
      } catch (error) {
        console.error('Error building blog image URL:', error);
      }
    }

    return (
      <main>
        <BlogDetailsWithSidebar blogData={blogData || null} mainImageUrl={mainImageUrl || undefined} />
      </main>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <main>
        <BlogDetailsWithSidebar blogData={null} />
      </main>
    );
  }
};

export default BlogDetailsWithSidebarPage;

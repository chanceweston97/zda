import { structuredAlgoliaHtmlData } from '@/algolia/crawlIndex';
import BlogDetails from '@/components/BlogDetails';
import { getPost, getPosts } from '@/sanity/sanity-blog-utils';
import { imageBuilder } from '@/sanity/sanity-shop-utils';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    if (!posts || !Array.isArray(posts)) {
      return [];
    }
    return posts
      .filter((post) => post?.slug?.current)
      .map((post) => ({
        slug: post.slug.current,
      }));
  } catch (error) {
    console.error('Error generating static params for blogs:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Params) {
  try {
    const { slug } = await params;
    if (!slug) {
      return {
        title: 'Not Found',
        description: 'No blog article has been found',
      };
    }

    const post = await getPost(slug);
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL || '';

    if (!post) {
      return {
        title: 'Not Found',
        description: 'No blog article has been found',
      };
    }

    const postTitle = post.title || 'Single Post Page';
    const postMetadata = post.metadata || '';
    const postSlug = post.slug?.current || slug;
    const postDescription = postMetadata.slice(0, 136) + (postMetadata.length > 136 ? '...' : '');

    // Build image URL safely
    let ogImageUrl = '';
    let twitterImageUrl = '';
    if (post.mainImage) {
      try {
        const imageUrl = imageBuilder(post.mainImage).url();
        if (imageUrl) {
          ogImageUrl = imageUrl;
          twitterImageUrl = imageUrl;
        }
      } catch (error) {
        console.error('Error building image URL for metadata:', error);
      }
    }

    return {
      title: `${postTitle} | ZDAComm - E-commerce Template`,
      description: postDescription,
      author: 'ZDAComm',
      alternates: {
        canonical: `${siteURL}/posts/${postSlug}`,
        languages: {
          'en-US': '/en-US',
          'de-DE': '/de-DE',
        },
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: `${postTitle} | ZDAComm`,
        description: postMetadata,
        url: `${siteURL}/posts/${postSlug}`,
        siteName: 'ZDAComm',
        images: ogImageUrl
          ? [
              {
                url: ogImageUrl,
                width: 1800,
                height: 1600,
                alt: postTitle,
              },
            ]
          : [],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${postTitle} | ZDAComm`,
        description: postDescription,
        creator: '@ZDAComm',
        site: '@ZDAComm',
        images: twitterImageUrl ? [twitterImageUrl] : [],
        url: `${siteURL}/blogs/${postSlug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for blog post:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the blog post',
    };
  }
}

const BlogDetailsPage = async ({ params }: Params) => {
  try {
    const { slug } = await params;
    if (!slug) {
      return (
        <main>
          <BlogDetails blogData={null} />
        </main>
      );
    }

    const post = await getPost(slug);

    // Build image URL on the server side
    let mainImageUrl = '';
    if (post?.mainImage) {
      try {
        const imageUrl = imageBuilder(post.mainImage).url();
        if (imageUrl) {
          mainImageUrl = imageUrl;
        }
      } catch (error) {
        console.error('Error building blog image URL:', error);
      }
    }

    // Only call structuredAlgoliaHtmlData if post exists and has required data
    if (post && post.slug?.current) {
      try {
        const siteURL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';
        await structuredAlgoliaHtmlData({
          type: 'blogs',
          title: post.title || '',
          htmlString: post.metadata || '',
          pageUrl: `${siteURL}/blogs/${post.slug.current}`,
          imageURL: mainImageUrl,
        });
      } catch (error) {
        console.error('Error in structuredAlgoliaHtmlData:', error);
        // Don't fail the page if Algolia indexing fails
      }
    }

    return (
      <main>
        <BlogDetails blogData={post || null} mainImageUrl={mainImageUrl || undefined} />
      </main>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <main>
        <BlogDetails blogData={null} />
      </main>
    );
  }
};

export default BlogDetailsPage;

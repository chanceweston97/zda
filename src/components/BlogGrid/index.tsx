import { getPosts } from "@/sanity/sanity-blog-utils";
import { imageBuilder } from "@/sanity/sanity-shop-utils";
import BlogItem from "../Blog/BlogItem";
import Breadcrumb from "../Common/Breadcrumb";

const BlogGrid = async () => {
  let blogData = [];
  
  try {
    blogData = await getPosts();
    if (!Array.isArray(blogData)) {
      blogData = [];
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    blogData = [];
  }

  // Build image URLs for all blogs on the server side
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
    return {
      ...blog,
      mainImageUrl,
    };
  });

  return (
    <>
      <Breadcrumb title={"Blog Grid"} pages={["blog grid"]} />{" "}
      <section className="py-20 overflow-hidden bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
          {blogsWithImageUrls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-7.5">
              {blogsWithImageUrls.map((blog) => (
                <BlogItem blog={blog} key={blog._id} mainImageUrl={blog.mainImageUrl} />
              ))}
            </div>
          ) : (
            <p className="text-center text-xl">No blog posts found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogGrid;

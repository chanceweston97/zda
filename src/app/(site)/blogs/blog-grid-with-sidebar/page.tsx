import BlogGridWithSidebar from '@/components/BlogGridWithSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Grid Page | NextMerce | Next.js E-commerce Boilerplate',
  description: 'This is Blog Grid Page for NextMerce Template',
  // other metadata
};

const BlogGridWithSidebarPage = () => {
  return (
    <>
      <BlogGridWithSidebar />
    </>
  );
};

export default BlogGridWithSidebarPage;

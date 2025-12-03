import BlogGridWithSidebar from '@/components/BlogGridWithSidebar';
import { Metadata } from 'next';

// Disable static generation - use dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog Grid Page | ZDAComm |  Store',
  description: 'This is Blog Grid Page for ZDAComm Template',
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

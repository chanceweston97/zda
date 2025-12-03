import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import OurStory from "@/components/OurStory";

export const metadata: Metadata = {
  title: "Our Story | ZDAComm | Store",
  description: "Learn about ZDA Communications and our focus on RF hardware since 2008",
  // other metadata
};

// Disable static generation since this page depends on dynamic Sanity data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const OurStoryPage = async () => {
  return (
    <>
      <OurStory />
    </>
  );
};

export default OurStoryPage;


import Breadcrumb from "@/components/Common/Breadcrumb";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import {
  getCategories,
  getCategoryBySlug,
  getCategoriesWithSubcategories,
  getProductsByFilter,
  imageBuilder,
} from "@/sanity/sanity-shop-utils";

type Params = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    date: string;
    sort: string;
  }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  const categoriesWithSubs = await getCategoriesWithSubcategories();
  
  // Include both parent categories and subcategories
  const allSlugs = [
    ...categories.map((category) => ({ slug: category.slug.current })),
    ...categoriesWithSubs.flatMap((category) => 
      category.subcategories?.map((sub) => ({ slug: sub.slug.current })) || []
    ),
  ];
  
  // Remove duplicates
  const uniqueSlugs = Array.from(
    new Map(allSlugs.map((item) => [item.slug, item])).values()
  );
  
  return uniqueSlugs;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const categoryData = await getCategoryBySlug(slug);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL;

  if (categoryData) {
    return {
      title: `${
        categoryData?.title || "Category Page"
      } | ZDAComm -  E-commerce Template`,
      description: `${categoryData?.description?.slice(0, 136)}...`,
      author: "ZDAComm",
      alternates: {
        canonical: `${siteURL}/categories/${categoryData?.slug?.current}`,
        languages: {
          "en-US": "/en-US",
          "de-DE": "/de-DE",
        },
      },

      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      // openGraph: {
      //   title: `${categoryData?.title} | ZDAComm`,
      //   description: categoryData.description,
      //   url: `${siteURL}/categories/${categoryData?.slug?.current}`,
      //   siteName: "ZDAComm",
      //   images: [
      //     {
      //       url: imageBuilder(categoryData.image).url(),
      //       width: 1800,
      //       height: 1600,
      //       alt: categoryData?.title,
      //     },
      //   ],
      //   locale: "en_US",
      //   type: "article",
      // },

      // twitter: {
      //   card: "summary_large_image",
      //   title: `${categoryData?.title} | ZDAComm`,
      //   description: `${categoryData?.description?.slice(0, 136)}...`,
      //   creator: "@ZDAComm",
      //   site: "@ZDAComm",
      //   images: [imageBuilder(categoryData.image).url()],
      //   url: `${siteURL}/categories/${categoryData?.slug?.current}`,
      // },
    };
  } else {
    return {
      title: "Not Found",
      description: "No product category has been found",
    };
  }
}

const CategoryPage = async ({ params, searchParams }: Params) => {
  const { slug } = await params;
  const { date, sort } = await searchParams;

  const categoryData = await getCategoryBySlug(slug);
  
  // Build category filter - include subcategories if viewing a parent category
  // Cable products are now manually created products (productType === "cable"), not cableType documents
  let categoryFilter = '';
  
  if (categoryData) {
    if (categoryData.subcategories && categoryData.subcategories.length > 0) {
      // Parent category: include products from subcategories
      const subcategoryIds = categoryData.subcategories.map((sub) => sub._id);
      const categoryIds = [categoryData._id, ...subcategoryIds].map((id) => `"${id}"`).join(', ');
      categoryFilter = `&& category._ref in [${categoryIds}]`;
    } else {
      // Regular category or subcategory: use category ID reference for better performance
      categoryFilter = `&& category._ref == "${categoryData._id}"`;
    }
  } else {
    // Fallback: try to find by slug (for categories without subcategories)
    categoryFilter = slug ? `&& category->slug.current == "${slug}"` : "";
  }

  const dateOrder = date ? `| order(_createdAt ${date})` : "";
  const sortOrder = sort ? `| order(count(reviews) desc)` : "";
  const order = `${dateOrder}${sortOrder}`;
  const query = `*[_type == "product" ${categoryFilter}] ${order} `;

  const data = await getProductsByFilter(query, ["product"]);

  // Clean slug by removing hyphens and symbol characters
  const cleanSlug = slug
    ? slug
        .replace(/[^a-zA-Z0-9\s]/g, "  ")
        .replace(/\s+/g, " ")
        .trim()
    : "Category Page";

  return (
    <main>
      <ShopWithoutSidebar shopData={data} />
    </main>
  );
};

export default CategoryPage;

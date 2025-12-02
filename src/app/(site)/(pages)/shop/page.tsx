import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getAllProducts,
  getAllProductsCount,
  getCategoriesWithSubcategories,
  getProductsByFilter,
} from '@/sanity/sanity-shop-utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Page | ZDAComm |  Store',
  description: 'This is Shop Page for ZDAComm Template',
  // other metadata
};

type PageProps = {
  searchParams: Promise<{
    category?: string;
    sizes?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

const ShopWithSidebarPage = async ({ searchParams }: PageProps) => {
  const { category, sizes, minPrice, maxPrice, sort } =
    await searchParams;

  const categoryIds = category?.split(',');
  const selectedSizes = sizes?.split(',');

  // Fetch categories first to use for filtering
  const [allProducts, categories, allProductsCount] = await Promise.all([
    getAllProducts(),
    getCategoriesWithSubcategories(),
    getAllProductsCount(),
  ]);

  let queries = {
    category: '',
    sizes: '',
    price: '',
  };

  if (categoryIds) {
    const allCategorySlugs: string[] = [];
    
    // Include selected categories and their subcategories
    categoryIds.forEach((slug) => {
      allCategorySlugs.push(slug);
      const category = categories.find(cat => cat.slug.current === slug);
      if (category?.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
          allCategorySlugs.push(sub.slug.current);
        });
      }
    });
    
    // Check if "cables" category is explicitly selected
    const hasCablesCategory = categoryIds.some(slug => slug.toLowerCase() === 'cables') ||
                              allCategorySlugs.some(slug => slug.toLowerCase() === 'cables');
    
    // Category filter: 
    // - If "cables" category is selected: show cables + products matching selected categories
    // - If "cables" category is NOT selected: only show products matching selected categories (exclude cables)
    if (hasCablesCategory) {
      queries.category = `&& (_type == "cableType" || category->slug.current in ${JSON.stringify(allCategorySlugs)})`;
    } else {
      // Explicitly exclude cableTypes when cables category is not selected
      queries.category = `&& _type != "cableType" && category->slug.current in ${JSON.stringify(allCategorySlugs)}`;
    }
  }

  if (selectedSizes) {
    queries.sizes = `&& count(sizes[ @ in ${JSON.stringify(selectedSizes)} ]) > 0`;
  }

  // Price filtering is now handled client-side since price comes from gainOptions
  // We'll filter products after fetching them

  let sortQuery = '| order(publishedAt desc)';

  if (sort === 'popular') {
    sortQuery = '| order(length(reviews) desc)';
  }

  const products = await getProductsByFilter(
    `*[_type == "product" ${Object.values(queries).join(' ')}] ${sortQuery}`,
    ['product']
  );

  return (
    <main>
      <ShopWithSidebar
        key={Object.values(await searchParams).join('')}
        data={{
          allProducts,
          products,
          categories,
          allProductsCount,
        }}
      />
    </main>
  );
};

export default ShopWithSidebarPage;
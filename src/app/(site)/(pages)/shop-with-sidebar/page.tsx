import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getAllProducts,
  getAllProductsCount,
  getCategories,
  getHighestPrice,
  getProductsByFilter,
} from '@/sanity/sanity-shop-utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Page | NextMerce | Next.js E-commerce Boilerplate',
  description: 'This is Shop Page for NextMerce Template',
  // other metadata
};

type PageProps = {
  searchParams: Promise<{
    category?: string;
    sizes?: string;
    colors?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

const ShopWithSidebarPage = async ({ searchParams }: PageProps) => {
  const { category, sizes, colors, minPrice, maxPrice, sort } =
    await searchParams;

  const categoryIds = category?.split(',');
  const selectedSizes = sizes?.split(',');
  const selectedColors = colors?.split(',');

  let queries = {
    category: '',
    sizes: '',
    colors: '',
    price: '',
  };

  if (categoryIds) {
    queries.category = `&& category->slug.current in ${JSON.stringify(categoryIds)}`;
  }


  if (selectedSizes) {
    queries.sizes = `&& count(sizes[ @ in ${JSON.stringify(selectedSizes)} ]) > 0`;
  }

  if (selectedColors) {
    queries.colors = `&& count(colors[ @ in ${JSON.stringify(selectedColors)} ]) > 0`;
  }

  if (minPrice || maxPrice) {
    queries.price = `&& price >= ${minPrice || 0} ${maxPrice ? `&& price <= ${maxPrice}` : ''
      }`;
  }

  let sortQuery = '| order(publishedAt desc)';

  if (sort === 'popular') {
    sortQuery = '| order(length(reviews) desc)';
  }

  const products = await getProductsByFilter(
    `*[_type == "product" ${Object.values(queries).join(' ')}] ${sortQuery}`,
    ['product']
  );

  const [allProducts, categories, allProductsCount, highestPrice] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getAllProductsCount(),
    getHighestPrice(),
  ]);

  return (
    <main>
      <ShopWithSidebar
        key={Object.values(await searchParams).join('')}
        data={{
          allProducts,
          products,
          categories,
          allProductsCount,
          highestPrice,
        }}
      />
    </main>
  );
};

export default ShopWithSidebarPage;
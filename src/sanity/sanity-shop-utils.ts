import { Category } from "@/types/category";
import { Countdown } from "@/types/countdown";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient, groq } from "next-sanity";
import { unstable_cache as cache } from "next/cache";
import clientConfig from "./config/client-config";
import {
  allCategoriesQuery,
  allProductsQuery,
  allConnectorsQuery,
  allCableTypesQuery,
  categoryByIdQuery,
  categoriesWithSubcategoriesQuery,
  countdownQuery,
  heroBannerQuery,
  heroIntroductionQuery,
  proudPartnersQuery,
  whatWeOfferQuery,
  ourStoryQuery,
  faqQuery,
  orderByIdQuery,
  orderData,
  productData,
  connectorData,
  cableTypeData,
  cableSeriesQuery,
  cableTypesQuery,
  cableTypesBySeriesQuery,
  connectorsQuery,
  singleCategoryQuery,
  singleCableTypeQuery,
} from "./queries/shop-queries"; 
import { sanityFetch } from "./sanity-utils";

const client = createClient(clientConfig);

export async function getCategories() {
  const data: Category[] = await sanityFetch({
    query: allCategoriesQuery,
    qParams: {},
    tags: ["category"],
  });
  return data;
}

export async function getCategoryBySlug(slug: string) {
  const data: Category = await sanityFetch({
    query: singleCategoryQuery,
    qParams: { slug },
    tags: ["category"],
  });
  return data;
}

export async function getCategoriesWithSubcategories() {
  const data: Category[] = await sanityFetch({
    query: categoriesWithSubcategoriesQuery,
    qParams: {},
    tags: ["category"],
  });
  return data;
}

export async function getCategoryById(id: string) {
  return await sanityFetch<Category>({
    query: categoryByIdQuery,
    qParams: { id },
    tags: ["category"],
  });
}

export async function getAllProducts() {
  // Fetch products, connectors, and cable types separately, then combine them
  // This avoids GROQ template interpolation issues in conditional projections
  const [products, connectors, cableTypes] = await Promise.all([
    sanityFetch<Product[]>({
    query: allProductsQuery,
    qParams: {},
    tags: ["product", "category"],
    }),
    sanityFetch<Product[]>({
      query: allConnectorsQuery,
      qParams: {},
      tags: ["connector", "category"],
    }),
    sanityFetch<Product[]>({
      query: allCableTypesQuery,
      qParams: {},
      tags: ["cableType", "category"],
    }),
  ]);
  
  // Process connectors: calculate minimum price from pricing array
  const processedConnectors = connectors.map((connector) => {
    if (connector.pricing && Array.isArray(connector.pricing) && connector.pricing.length > 0) {
      const prices = connector.pricing
        .map((p: any) => p?.price)
        .filter((price: any): price is number => typeof price === 'number' && price > 0);
      if (prices.length > 0) {
        connector.price = Math.min(...prices);
      }
    }
    return connector;
  });
  
  // Process cable types: use pricePerFoot as default price, or first lengthOption price if available
  const processedCableTypes = cableTypes.map((cableType) => {
    // If cable type has lengthOptions, use the first one's price
    if (cableType.lengthOptions && Array.isArray(cableType.lengthOptions) && cableType.lengthOptions.length > 0) {
      const firstLengthOption = cableType.lengthOptions[0];
      if (firstLengthOption && typeof firstLengthOption === 'object' && 'price' in firstLengthOption) {
        cableType.price = firstLengthOption.price;
      }
    }
    // Otherwise use pricePerFoot if available
    else if (cableType.cableType?.pricePerFoot) {
      cableType.price = cableType.cableType.pricePerFoot;
    }
    return cableType;
  });
  
  // Combine and sort by creation date
  const allItems = [...products, ...processedConnectors, ...processedCableTypes].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA; // Descending order
  });
  
  return allItems;
}

export const getProductsByFilter = cache(
  async (query: string, tags: string[]) => {
    // Modify query to include products, connectors, and cable types
    // Replace _type == "product" with union of product, connector, and cableType types
    const modifiedQuery = query.replace(
      /_type == "product"/g,
      '(_type == "product" || (_type == "connector" && isActive == true) || (_type == "cableType" && isActive == true))'
    );
    
    // Extract the filter part and sort part from the query
    // The query format is typically: *[_type == "product" ...filters...] ...sort...
    const match = modifiedQuery.match(/^\*\[(.*?)\]\s*(.*)$/);
    if (!match) {
      // Fallback: if query doesn't match expected format, use it as-is with productData
    const filterQuery = groq`${query} ${productData}`;
      return sanityFetch<Product[]>({
        query: filterQuery,
        qParams: {},
        tags,
      });
    }
    
    const filterPart = match[1];
    const sortPart = match[2] || '| order(_createdAt desc)';
    
    // Build the full query with conditional projection
    // We need to construct it as a string first, then parse with groq
    const queryString = `*[${filterPart}] ${sortPart} {
      _type == "product" => ${productData},
      _type == "connector" => ${connectorData},
      _type == "cableType" => ${cableTypeData}
    }`;
    
    const filterQuery = groq`${queryString}`;

    return sanityFetch<Product[]>({
      query: filterQuery,
      qParams: {},
      tags: [...tags, "connector", "cableType"],
    });
  },
  ["filtered-products"],
  { tags: ["product", "connector", "cableType"] }
);

export async function getAllProductsCount() {
  return client.fetch<number>(groq`count(*[_type == "product" || (_type == "connector" && isActive == true) || (_type == "cableType" && isActive == true)])`);
}

export async function getProduct(slug: string) {
  // Try to fetch as product first
  const product = await sanityFetch<Product>({
    query: groq`*[_type == "product" && slug.current == $slug] ${productData}[0]`,
    tags: ["product"],
    qParams: { slug },
  });
  
  // If not found, try to fetch as connector
  if (!product) {
    const connector = await sanityFetch<Product>({
      query: groq`*[_type == "connector" && isActive == true && slug.current == $slug] ${connectorData}[0]`,
      tags: ["connector"],
      qParams: { slug },
    });
    
    if (connector) {
      // Calculate minimum price from pricing array
      if (connector.pricing && Array.isArray(connector.pricing) && connector.pricing.length > 0) {
        const prices = connector.pricing
          .map((p: any) => p?.price)
          .filter((price: any): price is number => typeof price === 'number' && price > 0);
        if (prices.length > 0) {
          connector.price = Math.min(...prices);
        }
      }
      return connector;
    }
    
    // If not found as connector, try to fetch as cable type
    if (!connector) {
      const cableType = await sanityFetch<Product>({
        query: singleCableTypeQuery,
        tags: ["cableType"],
        qParams: { slug },
      });
      
      if (cableType) {
        // Price is calculated on frontend from pricePerFoot × length
        // Set default price to pricePerFoot for shop listing
        if (cableType.cableType?.pricePerFoot) {
          cableType.price = cableType.cableType.pricePerFoot;
        }
        return cableType;
      }
    }
  }
  
  return product;
}

export async function getHighestPrice() {
  const products = await sanityFetch<Product[]>({
    query: groq`*[_type == "product"] ${productData}`,
    qParams: {},
    tags: ["product"],
  });
  
  let highestPrice = 0;
  for (const product of products) {
    if (product.gainOptions && product.gainOptions.length > 0) {
      // Check all gain options to find the highest price
      for (const gainOption of product.gainOptions) {
        if (gainOption && typeof gainOption === 'object' && gainOption !== null && 'price' in gainOption && typeof gainOption.price === 'number') {
          highestPrice = Math.max(highestPrice, gainOption.price);
        }
      }
    }
  }
  
  return highestPrice;
}

export async function getOrders(query: string) {
  const orderQuery = groq`*[_type == "order" ${query}] | order(_createdAt desc) ${orderData}`;

  const data: Order[] = await sanityFetch({
    query: orderQuery,
    qParams: {},
    tags: ["order"],
  });
  return data;
}

// fetch unique orders by orderId
export async function getOrderById(orderId: string) {
  const data: Order = await sanityFetch({
    query: orderByIdQuery,
    qParams: { orderId },
    tags: ["order"],
  });
  return data;
}

export const getHeroBanners = cache(
  async () =>
    sanityFetch<any>({
      query: heroBannerQuery,
      qParams: {},
      tags: ["heroBanner"],
    }),
  ["hero-banners"],
  { tags: ["heroBanner"] }
);

export const getHeroSliders = cache(
  async () =>
    sanityFetch<any>({
      query: heroSliderQuery,
      qParams: {},
      tags: ["heroSlider"],
    }),
  ["hero-sliders"],
  { tags: ["heroSlider"] }
);

export const getHeroIntroduction = cache(
  async () =>
    sanityFetch<any>({
      query: heroIntroductionQuery,
      qParams: {},
      tags: ["heroIntroduction"],
    }),
  ["hero-introduction"],
  { tags: ["heroIntroduction"] }
);

export const getProudPartners = cache(
  async () =>
    sanityFetch<any>({
      query: proudPartnersQuery,
      qParams: {},
      tags: ["proudPartners"],
    }),
  ["proud-partners"],
  { tags: ["proudPartners"] }
);

export const getWhatWeOffer = cache(
  async () =>
    sanityFetch<any>({
      query: whatWeOfferQuery,
      qParams: {},
      tags: ["whatWeOffer"],
    }),
  ["what-we-offer"],
  { tags: ["whatWeOffer"] }
);

export const getOurStory = cache(
  async () =>
    sanityFetch<any>({
      query: ourStoryQuery,
      qParams: {},
      tags: ["ourStory"],
    }),
  ["our-story"],
  { tags: ["ourStory"] }
);

export const getFaq = cache(
  async () =>
    sanityFetch<any>({
      query: faqQuery,
      qParams: {},
      tags: ["faq"],
    }),
  ["faq"],
  { tags: ["faq"] }
);

export async function getCoupons() {
  return createClient(clientConfig).fetch(
    groq`*[_type == "coupon"] {
      _id,
      name,
      code,
      discount,
      maxRedemptions,
      timesRedemed
    }`
  );
}

export async function getCountdown() {
  const data: Countdown = await sanityFetch({
    query: countdownQuery,
    qParams: {},
    tags: ["countdown"],
  });
  return data;
}

export function imageBuilder(source: any) {
  return createImageUrlBuilder(clientConfig).image(source);
}

// Cable Customizer Functions
export async function getCableSeries() {
  return sanityFetch<any[]>({
    query: cableSeriesQuery,
    qParams: {},
    tags: ["cableSeries"],
  });
}

export async function getCableTypes() {
  return sanityFetch<any[]>({
    query: cableTypesQuery,
    qParams: {},
    tags: ["cableType"],
  });
}

export async function getCableTypesBySeries(seriesSlug: string) {
  return sanityFetch<any[]>({
    query: cableTypesBySeriesQuery,
    qParams: { seriesSlug },
    tags: ["cableType"],
  });
}

export async function getConnectors() {
  return sanityFetch<any[]>({
    query: connectorsQuery,
    qParams: {},
    tags: ["connector"],
  });
}

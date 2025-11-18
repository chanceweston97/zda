import { Category } from "@/types/category";
import { Countdown } from "@/types/countdown";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import ImageUrlBuilder from "@sanity/image-url";
import { createClient, groq } from "next-sanity";
import { unstable_cache as cache } from "next/cache";
import clientConfig from "./config/client-config";
import {
  allCategoriesQuery,
  allProductsQuery,
  categoryByIdQuery,
  countdownQuery,
  heroBannerQuery,
  heroSliderQuery,
  heroIntroductionQuery,
  orderByIdQuery,
  orderData,
  productData,
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
    query: allCategoriesQuery,
    qParams: { slug },
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
  return sanityFetch<Product[]>({
    query: allProductsQuery,
    qParams: {},
    tags: ["product", "category"],
  });
}

export const getProductsByFilter = cache(
  async (query: string, tags: string[]) => {
    const filterQuery = groq`${query} ${productData}`;

    return sanityFetch<Product[]>({
      query: filterQuery,
      qParams: {},
      tags,
    });
  },
  ["filtered-products"],
  { tags: ["product"] }
);

export async function getAllProductsCount() {
  return client.fetch<number>(groq`count(*[_type == "product"])`);
}

export async function getProduct(slug: string) {
  return sanityFetch<Product>({
    query: groq`*[_type == "product" && slug.current == $slug] ${productData}[0]`,
    tags: ["product"],
    qParams: { slug },
  });
}

export async function getHighestPrice() {
  return client.fetch<number>(
    groq`*[_type == "product"] | order(price desc)[0].price`
  );
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
  return ImageUrlBuilder(clientConfig).image(source);
}

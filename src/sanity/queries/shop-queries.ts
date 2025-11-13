import { groq } from "next-sanity";

// product data for all the utils functions
export const productData = `
{
  _id,
  name,
  description,
  shortDescription,
  category->,
  slug,
  tags,
  colors,
  sizes,
  customAttributes,
  additionalInformation,
  thumbnails,
  previewImages,
  publishedAt,
  price,
  discountedPrice,
  offers,
  status,
  price_id,
  body, 
  currency,
  'reviews': *[_type == "review" &&  references(^._id)] | order(publishedAt desc) {_id, name, email, comment}
}
`;

export const orderData = `{
  _id,
  orderId,
  status,
  totalPrice,
  userId,
  quantity,
  orderTitle,
  _createdAt
}
`;

export const allCategoriesQuery = groq`
    *[_type == "category" && count(*[_type == "product" && references(^._id)]) > 0]  {
      _id,
      title,
      image,
      slug,
      "productCount": count(*[_type == "product" && references(^._id)])
    }`;

export const singleCategoryQuery = groq`
*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  image,
  slug,
  "productCount": count(*[_type == "product" && references(^._id)])
}
`;

export const categoryByIdQuery = groq`*[_type == "category" && _id == $id][0] {
  _id,
  title,
}`;

export const allProductsQuery = groq`*[_type == "product"] | order(_createdAt desc) ${productData}`;

export const bestSellerQuery = groq`*[_type == "product"] | order(count(reviews) desc) ${productData}`;

export const singleProductQuery = groq`*[_type == "product" && slug.current == $slug][0] ${productData}`;

export const productByCategoryQuery = groq`*[_type == "product" && category->slug.current == $slug] | order(_createdAt desc) ${productData}`;

export const allOrdersQuery = groq`*[_type == "order"] | order(_createdAt desc)  ${orderData}`;
export const orderByIdQuery = groq`*[_type == "order" && orderId == $orderId][0] ${orderData}`;

export const heroBannerQuery = groq`*[_type == "heroBanner"] | order(_createdAt desc) {
  _id,
  name,
  image,
  product->{
    shortDescription,
    slug,
    name,
    discountedPrice,
    price
  }
}`;
export const heroSliderQuery = groq`*[_type == "heroSlider"] | order(_createdAt desc) {
  _id,
  name,
  image,
  discount,
  product->{
    shortDescription,
    slug,
    name,
    discountedPrice,
    price
  }
}`;

export const countdownQuery = groq`*[_type == "countdown"][0] {
  _id,
  title,
  image,
  subtitle,
  date,
  product->{
    slug,
    name,
  }
}`;

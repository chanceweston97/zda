import { groq } from "next-sanity";

// Product data projection - handles all product types (antenna, cable, connector)
export const productData = `
{
  _id,
  name,
  slug,
  price,
  tags,
  category->,
  sku,
  productType,
  displayOrder,

  // Cable-specific fields
  cableSeries->{
    _id,
    name,
    slug
  },
  pricePerFoot,
  lengthOptions[]{
    length,
    price
  },

  // Connector-specific fields
  connectorPricing[]{
    "cableType": cableType->{
      _id,
      name,
      "slug": slug.current
    },
    price
  },

  // Legacy connector reference (for backward compatibility)
  connector->{
    _id,
    name,
    slug,
    image,
    "pricing": pricing[]{
      cableType->{
        _id,
        name
      },
      price
    }
  },
  cableType->{
    _id,
    name,
    slug,
    pricePerFoot,
    series->{
      _id,
      name
    }
  },

  // Hero overview block
  featureTitle,
  features,
  applications,

  // Technical / hero fields
  gainOptions[]{
    gain,
    price
  },
  quantity,

  // Images
  thumbnails,
  previewImages,

  // Datasheet
  datasheetImage,
  datasheetPdf,
  "datasheetPdfUrl": datasheetPdf.asset->url,

  // Tabs
  description,
  specifications,

  // Meta
  publishedAt,
  status,

  // Reviews
  "reviews": *[_type == "review" && references(^._id)] 
    | order(publishedAt desc) {
      _id,
      name,
      email,
      comment
    }
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

// Legacy connector data query - for backward compatibility with existing connector documents
export const connectorData = `
{
  _id,
  name,
  slug,
  category->,
  "pricing": pricing[]{
    "cableType": cableType->{
      _id,
      name,
      "slug": slug.current
    },
    price
  },
  "thumbnails": [{
    "image": image,
    "color": null
  }],
  "previewImages": [{
    "image": image,
    "color": null
  }],
  "connector": {
    "pricing": pricing[]{
      "cableType": cableType->{
        _id,
        name,
        "slug": slug.current
      },
      price
    }
  },
  "productType": "connector",
  "status": isActive,
  "publishedAt": _createdAt,
  "tags": [],
  "sku": null,
  "gainOptions": [],
  "quantity": 1,
  "featureTitle": null,
  "features": null,
  "applications": null,
  "datasheetImage": null,
  "datasheetPdf": null,
  "datasheetPdfUrl": null,
  "description": null,
  "specifications": null,
  "reviews": []
}
`;

// Legacy cable type data query - for backward compatibility with existing cableType documents
export const cableTypeData = `
{
  _id,
  name,
  slug,
  category->,
  sku,
  "cableType": {
    _id,
    name,
    slug,
    pricePerFoot,
    "series": series->{
      _id,
      name,
      slug
    }
  },
  "cableSeries": series->{
    _id,
    name,
    slug
  },
  "thumbnails": [{
    "image": image,
    "color": null
  }],
  "previewImages": [{
    "image": image,
    "color": null
  }],
  "productType": "cable",
  "status": isActive,
  "publishedAt": _createdAt,
  "tags": [],
  "gainOptions": [],
  "lengthOptions": lengthOptions[]{
    length
  },
  "quantity": coalesce(quantity, 1),
  "featureTitle": null,
  "features": null,
  "applications": null,
  "datasheetImage": null,
  "datasheetPdf": null,
  "datasheetPdfUrl": null,
  "description": description,
  "specifications": specifications,
  "reviews": [],
  "connector": null,
  "pricing": null,
  "price": pricePerFoot
}
`;

export const allCategoriesQuery = groq`
    *[_type == "category" && (count(*[_type == "product" && references(^._id)]) > 0 || count(*[_type == "connector" && references(^._id) && isActive == true]) > 0 || count(*[_type == "cableType" && references(^._id) && isActive == true]) > 0 || (lower(slug.current) == "cables" && count(*[_type == "cableType" && isActive == true]) > 0))]  {
      _id,
      title,
      image,
      slug,
      "productCount": count(*[_type == "product" && references(^._id)]) + count(*[_type == "connector" && references(^._id) && isActive == true]) + select(
        lower(slug.current) == "cables" => count(*[_type == "cableType" && isActive == true]),
        count(*[_type == "cableType" && references(^._id) && isActive == true])
      ),
      parent-> {
        _id,
        title,
        slug
      },
      "subcategories": *[_type == "category" && parent._ref == ^._id] {
        _id,
        title,
        slug,
        "productCount": count(*[_type == "product" && references(^._id)]) + count(*[_type == "connector" && references(^._id) && isActive == true]) + select(
          lower(slug.current) == "cables" => count(*[_type == "cableType" && isActive == true]),
          count(*[_type == "cableType" && references(^._id) && isActive == true])
        )
      }
    }`;

export const singleCategoryQuery = groq`
*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  image,
  slug,
  description,
  "productCount": count(*[_type == "product" && references(^._id)]) + count(*[_type == "connector" && references(^._id) && isActive == true]) + select(
    lower(slug.current) == "cables" => count(*[_type == "cableType" && isActive == true]),
    count(*[_type == "cableType" && references(^._id) && isActive == true])
  ),
  parent-> {
    _id,
    title,
    slug
  },
  "subcategories": *[_type == "category" && parent._ref == ^._id] {
    _id,
    title,
    slug,
    "productCount": count(*[_type == "product" && references(^._id)]) + count(*[_type == "connector" && references(^._id) && isActive == true]) + select(
      lower(slug.current) == "cables" => count(*[_type == "cableType" && isActive == true]),
      count(*[_type == "cableType" && references(^._id) && isActive == true])
    )
  }
}
`;

export const categoriesWithSubcategoriesQuery = groq`
*[_type == "category" && !defined(parent)] | order(title asc) {
  _id,
  title,
  image,
  slug,
  "productCount": coalesce(count(*[_type == "product" && references(^._id)]) + count(*[_type == "connector" && references(^._id) && isActive == true]) + select(
    lower(slug.current) == "cables" => count(*[_type == "cableType" && isActive == true]),
    count(*[_type == "cableType" && references(^._id) && isActive == true])
  ), 0),
  "subcategories": *[_type == "category" && defined(parent) && parent._ref == ^._id] | order(title asc) {
    _id,
    title,
    slug,
    "productCount": coalesce(count(*[_type == "product" && references(^._id)]) + count(*[_type == "connector" && references(^._id) && isActive == true]) + select(
      lower(slug.current) == "cables" => count(*[_type == "cableType" && isActive == true]),
      count(*[_type == "cableType" && references(^._id) && isActive == true])
    ), 0)
  }
}
`;

export const categoryByIdQuery = groq`*[_type == "category" && _id == $id][0] {
  _id,
  title,
}`;

export const allProductsQuery = groq`*[_type == "product"] | order(displayOrder asc, _createdAt desc) ${productData}`;

// Legacy queries for backward compatibility with existing connector and cableType documents
export const allConnectorsQuery = groq`*[_type == "connector" && isActive == true] | order(_createdAt desc) ${connectorData}`;
export const allCableTypesQuery = groq`*[_type == "cableType" && isActive == true] | order(_createdAt desc) ${cableTypeData}`;

// Combined query to get products, connectors, and cable types
export const allProductsAndConnectorsQuery = `*[_type == "product" || (_type == "connector" && isActive == true) || (_type == "cableType" && isActive == true)] | order(_createdAt desc) {
  _type == "product" => ${productData},
  _type == "connector" => ${connectorData},
  _type == "cableType" => ${cableTypeData}
}`;

export const bestSellerQuery = groq`*[_type == "product"] | order(count(reviews) desc) ${productData}`;

export const singleProductQuery = groq`*[_type == "product" && slug.current == $slug][0] ${productData}`;
export const singleCableTypeQuery = groq`*[_type == "cableType" && isActive == true && slug.current == $slug][0] ${cableTypeData}`;

export const productByCategoryQuery = groq`*[_type == "product" && category->slug.current == $slug] | order(displayOrder asc, _createdAt desc) ${productData}`;

export const allOrdersQuery = groq`*[_type == "order"] | order(_createdAt desc)  ${orderData}`;
export const orderByIdQuery = groq`*[_type == "order" && orderId == $orderId][0] ${orderData}`;

export const heroBannerQuery = groq`*[_type == "heroBanner" && isActive == true] | order(_createdAt desc) [0] {
  _id,
  name,
  isActive,
  backgroundImage,
  title,
  buttons[]{
    text,
    link
  },
  brandName,
  card{
    image,
    title,
    description
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

export const heroIntroductionQuery = groq`*[_type == "heroIntroduction" && isActive == true] | order(_createdAt desc) [0] {
  _id,
  name,
  isActive,
  title,
  description,
  buttons[]{
    text,
    link
  },
  image
}`;

export const proudPartnersQuery = groq`*[_type == "proudPartners" && isActive == true] | order(_createdAt desc) [0] {
  _id,
  name,
  isActive,
  title,
  partners[]{
    name,
    logo
  }
}`;

export const whatWeOfferQuery = groq`*[_type == "whatWeOffer" && isActive == true] | order(_createdAt desc) [0] {
  _id,
  name,
  isActive,
  title,
  headerButton{
    text,
    link
  },
  offerItems[]{
    title,
    tags,
    description,
    button{
      text,
      link
    },
    image,
    imagePosition
  }
}`;

export const ourStoryQuery = groq`*[_type == "ourStory" && isActive == true] | order(_createdAt desc) [0] {
  _id,
  name,
  isActive,
  heroSection{
    title,
    description
  },
  whatWeFocusOn{
    title,
    introText,
    items[]{
      title,
      description
    },
    closingText,
    image
  },
  letsWorkTogether{
    title,
    introText,
    subtitle,
    items,
    closingText,
    image,
    buttons[]{
      text,
      link
    }
  }
}`;

export const faqQuery = groq`*[_type == "faq" && isActive == true] | order(_createdAt desc) [0] {
  _id,
  name,
  isActive,
  title,
  contactButton{
    text,
    link
  },
  items[] | order(order asc) {
    question,
    answer,
    order
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

// Cable Customizer Queries - these query products with productType == "cable"
export const cableSeriesQuery = groq`*[_type == "cableSeries"] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  order
}`;

// Query cable products from unified product type
export const cableProductsQuery = groq`*[_type == "product" && productType == "cable" && status == true] | order(displayOrder asc) {
  _id,
  name,
  "slug": slug.current,
  "series": cableSeries->{
    _id,
    name,
    "slug": slug.current
  },
  pricePerFoot,
  "image": thumbnails[0].image,
  displayOrder
}`;

// Query connector products from unified product type
export const connectorProductsQuery = groq`*[_type == "product" && productType == "connector" && status == true] | order(displayOrder asc) {
  _id,
  name,
  "slug": slug.current,
  "image": thumbnails[0].image,
  "pricing": connectorPricing[]{
    "cableType": cableType->{
      _id,
      name,
      "slug": slug.current
    },
    price
  },
  displayOrder
}`;

// Legacy queries for cable customizer (backward compatibility with existing cableType/connector documents)
export const cableTypesQuery = groq`*[_type == "cableType" && isActive == true] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  "series": series->{
    _id,
    name,
    "slug": slug.current
  },
  pricePerFoot,
  image,
  order,
  isActive
}`;

export const cableTypesBySeriesQuery = groq`*[_type == "cableType" && isActive == true && series->slug.current == $seriesSlug] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  "series": series->{
    _id,
    name,
    "slug": slug.current
  },
  pricePerFoot,
  image,
  order,
  isActive
}`;

export const connectorsQuery = groq`*[_type == "connector" && isActive == true] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  image,
  pricing[]{
    "cableType": cableType->{
      _id,
      name,
      "slug": slug.current
    },
    price
  },
  order,
  isActive
}`;

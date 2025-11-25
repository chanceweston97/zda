import { PortableTextBlock } from "sanity";

export type Product = {
  _id: string;
  name: string;
  reviews: string[];
  price?: number; // Default price (shown on shop/category pages)
  discountedPrice?: number;
  category?: string;
  tags?: string[];
  description?: PortableTextBlock[];
  shortDescription?: string;
  colors?: string[];
  thumbnails?: any;
  previewImages?: any;
  additionalInformation?: {
    name: string;
    description: string;
  }[];
  customAttributes?: {
    attributeName: string;
    attributeValues: Array<{
      id: string;
      title: string;
    }>;
  }[];
  status?: boolean;
  offers?: string[];
  slug?: {
    current: string;
  };
  price_id?: string;
  currency?: string;
  sku?: string;
  body?: PortableTextBlock[];
  sizes?: string[];
  inStock?: boolean;
  quantity?: number;
  gainOptions?: Array<{
    gain: string;
    price: number;
  }> | string[]; // Support both new format (objects) and old format (strings)
  featureTitle?: string;
  features?: string[];
  applications?: string[];
  // Product type and connector-specific fields
  productType?: "antenna" | "connector";
  connector?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    image?: any;
  };
  cableSeries?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
  };
  cableType?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    series?: {
      _id: string;
      name: string;
    };
  };
  pricePerFoot?: number; // For connector products: price per foot to calculate total price
  lengthOptions?: string[]; // For connector products: e.g., ["10 ft", "25 ft", "50 ft"]
};

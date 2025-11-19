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
};

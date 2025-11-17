import { PortableTextBlock } from "sanity";

export type Product = {
  _id: string;
  name: string;
  price: number;
  features:string;
  featureTitle:string;
  gainOptions:any;
  category?: string;
  tags?: string[];
  description?: PortableTextBlock[];
  specifications?: string;
  colors?: string[];
  thumbnails?: any;
  previewImages?: any;
  status?: boolean;
  slug?: {
    current: string;
  };
  price_id?: string;
  currency?: string;
  inStock?: boolean;
  quantity?: number;
  publishedAt?:any;
  datasheetImage?:any;
  datasheetPdf?:any;
};

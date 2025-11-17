import { PortableTextBlock } from "sanity";

export type SanityImage = {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
  alt?: string;
  url?: string; // optional, if you choose to resolve & store it
};

export type SanityFile = {
  _type: "file";
  asset: {
    _type: "reference";
    _ref: string;
  };
  url?: string; // <-- this is the actual downloadable URL
};

export type GainOption = {
  _key: string;
  label: string;   // e.g. "6 dBi"
  value: number;   // e.g. 6
};

export type Product = {
  _id: string;

  /** Basic PDP fields */
  name: string;
  price: number;
  heroTitle?: string;

  /** Category */
  category?: {
    _id: string;
    title: string;
    slug?: { current: string };
  } | null;

  /** Right-side highlighted description block */
  descriptionTitle?: PortableTextBlock[];
  description?: PortableTextBlock[];

  /** Tabs */
  descriptionTab?: PortableTextBlock[];
  specificationsTab?: PortableTextBlock[];

  /** Gain dropdown */
  gainOptions?: GainOption[];

  /** Images */
  thumbnail?: SanityImage | null;
  previewImages?: SanityImage[];

  /** Datasheet */
  dataSheetImage?: SanityImage | null; // small preview
  dataSheetPdf?: SanityFile | null;    // file + downloadable URL

  /** Inventory */
  quantity?: number;
  status?: boolean;
  publishedAt?: string;

  /** Optional legacy fields */
  slug?: { current: string };
};

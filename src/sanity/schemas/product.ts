import { CableCategoryInput } from "../components/CableCategoryInput";

const product = {
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "basic", title: "Basic Info", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "media", title: "Images & Datasheet" },
    { name: "details", title: "Details" },
  ],
  fields: [
    // ───────── BASIC INFO ─────────
    {
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      group: "basic",
    },
    {
      name: "productType",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Antenna", value: "antenna" },
          { title: "Cable", value: "cable" },
          { title: "Connector", value: "connector" },
        ],
        layout: "dropdown",
      },
      initialValue: "antenna",
      validation: (Rule: any) => Rule.required(),
      group: "basic",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        unique: true,
        slugify: (input: any) => {
          return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
        },
      },
      validation: (Rule: any) =>
        Rule.required().custom((fields: any) => {
          if (
            fields?.current !== fields?.current?.toLowerCase() ||
            fields?.current.split(" ").includes("")
          ) {
            return "Slug must be lowercase and not be included space";
          }
          return true;
        }),
      group: "basic",
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule: any) =>
        Rule.custom((category: any) => {
          if (!category) {
            return "Category is required";
          }
          return true;
        }),
      description: "Select the appropriate product category.",
      group: "basic",
    },
    {
      name: "sku",
      title: "SKU",
      type: "string",
      description: "Product SKU (Stock Keeping Unit) identifier",
      group: "basic",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "string",
          title: "Tag",
        },
      ],
      group: "basic",
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
      group: "basic",
    },
    {
      name: "status",
      title: "Stock Status",
      type: "boolean",
      initialValue: true,
      group: "basic",
    },

    // ───────── PRICING SECTION ─────────
    // Default Price (for Antenna)
    {
      name: "price",
      title: "Default Price",
      type: "number",
      description: "Default price shown on shop and category pages. Base price before gain selection.",
      hidden: ({ parent }: any) => parent?.productType !== "antenna",
      validation: (Rule: any) =>
        Rule.custom((price: any, context: any) => {
          if (context.parent?.productType === "antenna" && (!price || price <= 0)) {
            return "Price is required for antenna products";
          }
          return true;
        }),
      group: "pricing",
    },
    // Gain Options (Antenna only)
    {
      name: "gainOptions",
      title: "Gain Options",
      type: "array",
      hidden: ({ parent }: any) => parent?.productType !== "antenna",
      validation: (Rule: any) =>
        Rule.custom((gainOptions: any, context: any) => {
          if (context.parent?.productType === "antenna" && (!gainOptions || gainOptions.length === 0)) {
            return "At least one Gain Option is required for antenna products";
          }
          return true;
        }),
      of: [
        {
          type: "object",
          name: "gainOption",
          title: "Gain Option",
          fields: [
            {
              name: "gain",
              title: "Gain Value (dBi)",
              type: "string",
              description: "Gain value (e.g., '6', '8', '12')",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "price",
              title: "Price",
              type: "number",
              description: "Price for this gain option.",
              validation: (Rule: any) => Rule.required().min(0),
            },
          ],
          preview: {
            select: {
              gain: "gain",
              price: "price",
            },
            prepare(selection: any) {
              const { gain, price } = selection;
              return {
                title: `${gain} dBi`,
                subtitle: `$${price?.toFixed(2) || '0.00'}`,
              };
            },
          },
        },
      ],
      description:
        "Multiple selectable gain values with their corresponding prices.",
      group: "pricing",
    },

    // ───────── CABLE-SPECIFIC FIELDS ─────────
    {
      name: "cableSeries",
      title: "Cable Series",
      type: "reference",
      to: [{ type: "cableSeries" }],
      hidden: ({ parent }: any) => parent?.productType !== "cable",
      description: "Which series does this cable belong to? (RG Series or LMR Series)",
      group: "pricing",
    },
    {
      name: "pricePerFoot",
      title: "Price Per Foot ($)",
      type: "number",
      hidden: ({ parent }: any) => parent?.productType !== "cable",
      validation: (Rule: any) =>
        Rule.custom((price: any, context: any) => {
          if (context.parent?.productType === "cable" && (!price || price <= 0)) {
            return "Price per foot is required for cable products";
          }
          return true;
        }),
      description: "Price per foot for this cable type",
      group: "pricing",
    },
    {
      name: "lengthOptions",
      title: "Length Options",
      type: "array",
      hidden: ({ parent }: any) => parent?.productType !== "cable",
      of: [
        {
          type: "object",
          name: "lengthOption",
          title: "Length Option",
          fields: [
            {
              name: "length",
              title: "Length (ft)",
              type: "string",
              description: "Cable length (e.g., '10', '25', '50')",
            },
            {
              name: "price",
              title: "Price Override ($)",
              type: "number",
              description: "Optional: Override the calculated price (Price Per Foot × Length) with a fixed price",
            },
          ],
          preview: {
            select: {
              length: "length",
              price: "price",
            },
            prepare(selection: any) {
              const { length, price } = selection;
              return {
                title: `${length} ft`,
                subtitle: price ? `$${price.toFixed(2)}` : "Price calculated from price per foot",
              };
            },
          },
        },
      ],
      description:
        "Multiple selectable cable lengths. Price will be calculated as Price Per Foot × Length unless a price override is set.",
      group: "pricing",
    },

    // ───────── CONNECTOR-SPECIFIC FIELDS ─────────
    {
      name: "connectorPricing",
      title: "Pricing by Cable Type",
      type: "array",
      hidden: ({ parent }: any) => parent?.productType !== "connector",
      validation: (Rule: any) =>
        Rule.custom((pricing: any, context: any) => {
          if (context.parent?.productType === "connector" && (!pricing || pricing.length === 0)) {
            return "At least one cable type pricing is required for connector products";
          }
          return true;
        }),
      description: "Set the price for this connector for each cable type",
      of: [
        {
          type: "object",
          name: "cablePricing",
          title: "Cable Type Pricing",
          fields: [
            {
              name: "cableType",
              title: "Cable Type",
              type: "reference",
              to: [{ type: "product" }],
              options: {
                filter: 'productType == "cable"',
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "price",
              title: "Price ($)",
              type: "number",
              validation: (Rule: any) => Rule.required().min(0),
              description: "Price for this connector when used with the selected cable type",
            },
          ],
          preview: {
            select: {
              cableType: "cableType.name",
              price: "price",
            },
            prepare(selection: any) {
              const { cableType, price } = selection;
              return {
                title: cableType || "No Cable Type",
                subtitle: `$${price?.toFixed(2) || "0.00"}`,
              };
            },
          },
        },
      ],
      group: "pricing",
    },

    // ───────── COMMON FIELDS ─────────
    {
      name: "quantity",
      title: "Default Quantity",
      type: "number",
      description: "Default quantity shown on the product page (e.g. 1).",
      initialValue: 1,
      group: "basic",
    },
    {
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Order in which this product appears in listings (lower numbers appear first)",
      initialValue: 0,
      group: "basic",
    },

    // ───────── HERO OVERVIEW (highlighted block under price) ─────────
    {
      name: "featureTitle",
      title: "Feature Title",
      type: "string",
      description: "",
      group: "details",
    },
    {
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      description: "",
      group: "details",
    },
    {
      name: "applications",
      title: "Applications",
      type: "array",
      of: [{ type: "string" }],
      description: "",
      group: "details",
    },

    // ───────── IMAGES & DATASHEET ─────────
    {
      name: "thumbnails",
      title: "Thumbnails",
      type: "array",
      validation: (Rule: any) =>
        Rule.custom((thumbnails: any, context: any) => {
          if (!thumbnails || thumbnails.length === 0) {
            return "At least one thumbnail is required";
          }
          return true;
        }),
      of: [
        {
          type: "object",
          name: "thumbnail",
          title: "Thumbnail",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
            {
              name: "color",
              title: "Color",
              type: "string",
            },
          ],
          preview: {
            select: {
              title: "color",
              media: "image",
            },
            prepare(selection: any) {
              const { title, media } = selection;
              return {
                title: title || "Thumbnail",
                media,
              };
            },
          },
        },
      ],
      group: "media",
    },
    {
      name: "previewImages",
      title: "Preview Images",
      type: "array",
      validation: (Rule: any) =>
        Rule.custom((images: any, context: any) => {
          if (!images || images.length === 0) {
            return "At least one preview image is required";
          }
          return true;
        }),
      of: [
        {
          type: "object",
          name: "previewImage",
          title: "Preview Image",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
            {
              name: "color",
              title: "Color",
              type: "string",
            },
          ],
          preview: {
            select: {
              title: "color",
              media: "image",
            },
            prepare(selection: any) {
              const { title, media } = selection;
              return {
                title: title || "Preview Image",
                media,
              };
            },
          },
        },
      ],
      group: "media",
    },
    {
      name: "datasheetImage",
      title: "Datasheet Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Preview image of the datasheet shown on the product page (bottom left).",
      group: "media",
    },
    {
      name: "datasheetPdf",
      title: "Datasheet PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      description:
        "PDF file of the datasheet. You'll link to this from the Download Data Sheet button.",
      group: "media",
    },

    // ───────── TABS: DESCRIPTION & SPECIFICATIONS ─────────
    {
      name: "description",
      title: "Description",
      type: "blockContent",
      description:
        "Rich text content for the Description tab (main body text on the left).",
      group: "details",
    },
    {
      name: "specifications",
      title: "Specifications",
      type: "blockContent",
      description:
        "Rich text content for the Specifications tab (features, applications, technical details).",
      group: "details",
    },
  ],

  preview: {
    select: {
      title: "name",
      productType: "productType",
      category: "category.title",
      media: "thumbnails.0.image",
    },
    prepare(selection: any) {
      const { title, productType, category, media } = selection;
      const typeLabel = productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : "Product";
      return {
        title,
        subtitle: `${typeLabel} - ${category || "No Category"}`,
        media,
      };
    },
  },
};

export default product;

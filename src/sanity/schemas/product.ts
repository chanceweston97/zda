const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    // ───────── PRODUCT TYPE SELECTOR ─────────
    {
      name: "productType",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Antenna", value: "antenna" },
        ],
        layout: "radio",
      },
      initialValue: "antenna",
      validation: (Rule: any) => Rule.required(),
      description: "Select whether this is an Antenna product",
    },
    // ───────── BASIC INFO ─────────
    {
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
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
    },
    {
      name: "price",
      title: "Default Price",
      type: "number",
      description: "Default price shown on shop and category pages. Base price before gain selection.",
      validation: (Rule: any) =>
        Rule.custom((price: any, context: any) => {
          if (!price || price <= 0) {
            return "Price is required";
          }
          return true;
        }),
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
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule: any) =>
        Rule.custom((category: any, context: any) => {
          const productType = context.document?.productType;
          if (!category) {
            return "Category is required";
          }
          return true;
        }),
      description: "Select the appropriate product category (e.g., Antennas).",
    },
    {
      name: "sku",
      title: "SKU",
      type: "string",
      description: "Product SKU (Stock Keeping Unit) identifier",
    },

    // ───────── HERO OVERVIEW (highlighted block under price) ─────────
    {
      name: "featureTitle",
      title: "Feature Title",
      type: "string",
      description:
        "",
    },
    {
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      description:
        "",
    },
    {
      name: "applications",
      title: "Applications",
      type: "array",
      of: [{ type: "string" }],
      description:
        "",
    },

    // ───────── TECHNICAL FIELDS SHOWN IN THE HERO AREA ─────────
    {
      name: "gainOptions",
      title: "Gain Options",
      type: "array",
      validation: (Rule: any) =>
        Rule.custom((gainOptions: any, context: any) => {
          if (!gainOptions || gainOptions.length === 0) {
            return "At least one Gain Option is required";
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
              description: "Price for this gain option. The first gain option's price will be used as the default product price.",
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
        "Multiple selectable gain values with their corresponding prices. Each gain option can have a different price. The first gain option's price is used as the default product price.",
    },
    {
      name: "quantity",
      title: "Default Quantity",
      type: "number",
      description: "Default quantity shown on the product page (e.g. 1).",
      initialValue: 1,
    },

    // ───────── IMAGES & DATASHEET ─────────
     {
      name: "thumbnails",
      title: "Thumbnails",
      type: "array",
      validation: (Rule: any) => Rule.required(),
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
    },
    {
      name: "previewImages",
      title: "Preview Images",
      type: "array",
      validation: (Rule: any) => Rule.required(),

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
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "status",
      title: "Stock Status",
      type: "boolean",
    },
    {
      name: "datasheetImage",
      title: "Datasheet Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Preview image of the datasheet shown on the product page (bottom left).",
    },
    {
      name: "datasheetPdf",
      title: "Datasheet PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      description:
        "PDF file of the datasheet. You’ll link to this from the “Download Data Sheet” button.",
    },

    // ───────── TABS: DESCRIPTION & SPECIFICATIONS ─────────
    {
      name: "description",
      title: "Description",
      type: "blockContent",
      description:
        "Rich text content for the Description tab (main body text on the left).",
    },
    {
      name: "specifications",
      title: "Specifications",
      type: "blockContent",
      description:
        "Rich text content for the Specifications tab (features, applications, technical details).",
    },
  ],

  preview: {
    select: {
      title: "name",
      category: "category.title",
      media: "thumbnails.0.image",
    },
    prepare(selection: any) {
      const { title, category, media } = selection;
      return {
        title,
        subtitle: category || "Antenna",
        media,
      };
    },
  },
};

export default product;

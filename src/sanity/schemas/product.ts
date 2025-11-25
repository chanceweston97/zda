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
          { title: "Connector", value: "connector" },
        ],
        layout: "radio",
      },
      initialValue: "antenna",
      validation: (Rule: any) => Rule.required(),
      description: "Select whether this is an Antenna or Connector product",
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
      description: "Default price shown on shop and category pages. For Antenna products: base price before gain selection. For Connector products: this will be the lowest price from the connector's cable type pricing (set automatically, but can be overridden).",
      hidden: ({ parent }: any) => parent?.productType === "connector",
      validation: (Rule: any) =>
        Rule.custom((price: any, context: any) => {
          const productType = context.document?.productType;
          if (productType !== "connector" && (!price || price <= 0)) {
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
      description: "⚠️ IMPORTANT: For Connector products, you must select the 'Connector' category. For Antenna products, select the appropriate antenna category (e.g., Antennas).",
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

    // ───────── CONNECTOR-SPECIFIC FIELDS ─────────
    {
      name: "connector",
      title: "Connector",
      type: "reference",
      to: [{ type: "connector" }],
      hidden: ({ parent }: any) => parent?.productType !== "connector",
      validation: (Rule: any) =>
        Rule.custom((connector: any, context: any) => {
          const productType = context.document?.productType;
          if (productType === "connector" && !connector) {
            return "Connector is required for Connector products. Select the connector (e.g., N-Male, N-Female) that this product represents.";
          }
          return true;
        }),
      description: "Select the connector type (e.g., N-Male, N-Female).",
    },
    {
      name: "cableSeries",
      title: "Cable Series",
      type: "reference",
      to: [{ type: "cableSeries" }],
      hidden: ({ parent }: any) => parent?.productType !== "connector",
      validation: (Rule: any) =>
        Rule.custom((cableSeries: any, context: any) => {
          const productType = context.document?.productType;
          if (productType === "connector" && !cableSeries) {
            return "Cable Series is required for Connector products (e.g., RG Series, LMR Series)";
          }
          return true;
        }),
      description: "Select the cable series for this connector product (e.g., RG Series, LMR Series). This will be displayed to customers.",
    },
    {
      name: "cableType",
      title: "Cable Type",
      type: "reference",
      to: [{ type: "cableType" }],
      hidden: ({ parent }: any) => parent?.productType !== "connector",
      options: {
        filter: ({ parent }: any) => {
          const seriesId = parent?.cableSeries?._ref;
          if (!seriesId) {
            return { filter: "isActive == true" };
          }
          return {
            filter: "series._ref == $seriesId && isActive == true",
            params: { seriesId },
          };
        },
      },
      validation: (Rule: any) =>
        Rule.custom((cableType: any, context: any) => {
          const productType = context.document?.productType;
          if (productType === "connector" && !cableType) {
            return "Cable Type is required for Connector products (e.g., LMR 400, LMR 600). This will be displayed to customers.";
          }
          return true;
        }),
      description: "Select the cable type for this connector product. Options are filtered by the selected Cable Series.",
    },
    {
      name: "pricePerFoot",
      title: "Price Per Foot ($)",
      type: "number",
      hidden: ({ parent }: any) => parent?.productType !== "connector",
      validation: (Rule: any) =>
        Rule.custom((pricePerFoot: any, context: any) => {
          const productType = context.document?.productType;
          if (productType === "connector" && (!pricePerFoot || pricePerFoot <= 0)) {
            return "Price per foot is required for Connector products. The total price will be calculated as: price per foot × selected length.";
          }
          return true;
        }),
      description: "Price per foot for this connector product. The total price will be calculated based on the customer's selected length (e.g., $5.00 per foot × 25 ft = $125.00).",
    },
    {
      name: "lengthOptions",
      title: "Length Options",
      type: "array",
      hidden: ({ parent }: any) => parent?.productType !== "connector",
      of: [{ type: "string" }],
      description: "Available length options for customers to select (e.g., '10 ft', '25 ft', '50 ft', '100 ft'). Make sure the format includes 'ft' so we can parse the number for price calculation.",
      validation: (Rule: any) =>
        Rule.custom((lengthOptions: any, context: any) => {
          const productType = context.document?.productType;
          if (productType === "connector" && (!lengthOptions || lengthOptions.length === 0)) {
            return "At least one length option is required for Connector products";
          }
          return true;
        }),
    },
    // ───────── TECHNICAL FIELDS SHOWN IN THE HERO AREA ─────────
    {
      name: "gainOptions",
      title: "Gain Options",
      type: "array",
      hidden: ({ parent }: any) => parent?.productType === "connector",
      validation: (Rule: any) =>
        Rule.custom((gainOptions: any, context: any) => {
          const productType = context.document?.productType;
          if (productType === "antenna" && (!gainOptions || gainOptions.length === 0)) {
            return "At least one Gain Option is required for Antenna products";
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
      productType: "productType",
      connectorName: "connector.name",
      cableSeries: "cableSeries.name",
      cableType: "cableType.name",
      media: "thumbnails.0.image",
      connectorImage: "connector.image",
    },
    prepare(selection: any) {
      const { title, category, productType, connectorName, cableSeries, cableType, media, connectorImage } = selection;
      let subtitle = category || "";
      if (productType === "connector") {
        const parts = [connectorName, cableSeries, cableType].filter(Boolean);
        subtitle = parts.length > 0 ? `${category || "Connector"} | ${parts.join(" - ")}` : category || "Connector";
      }
      return {
        title,
        subtitle: subtitle || (productType === "connector" ? "Connector" : "Antenna"),
        media: media || connectorImage,
      };
    },
  },
};

export default product;

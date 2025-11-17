const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    // ───────── BASIC INFO ─────────
    {
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },

    // ───────── HERO OVERVIEW (highlighted block under price) ─────────
    {
      name: "featureTtle",
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

    // ───────── TECHNICAL FIELDS SHOWN IN THE HERO AREA ─────────
    {
      name: "gainOptions",
      title: "Gain (dBi)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Multiple selectable gain values displayed in the PDP dropdown (e.g., “6 dBi”, “8 dBi”, “12 dBi”).",
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
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      description:
        "Main product image used in the hero section and product listings.",
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
      media: "thumbnail",
    },
    prepare(selection: any) {
      const { title, category, media } = selection;
      return {
        title,
        subtitle: category,
        media,
      };
    },
  },
};

export default product;

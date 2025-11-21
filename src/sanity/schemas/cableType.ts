const cableType = {
  name: "cableType",
  title: "Cable Type",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Cable Type Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      description: "e.g., 'LMR 195', 'RG 58', 'LMR 400 UltraFlex'",
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
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "series",
      title: "Cable Series",
      type: "reference",
      to: [{ type: "cableSeries" }],
      validation: (Rule: any) => Rule.required(),
      description: "Which series does this cable belong to? (RG Series or LMR Series)",
    },
    {
      name: "pricePerFoot",
      title: "Price Per Foot ($)",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
      description: "Price per foot for this cable type",
    },
    {
      name: "image",
      title: "Cable Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Image of the cable type (optional)",
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which this cable type appears in the dropdown (lower numbers appear first)",
      initialValue: 0,
    },
    {
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide this cable type from the customizer",
    },
  ],
  preview: {
    select: {
      title: "name",
      series: "series.name",
      price: "pricePerFoot",
      media: "image",
    },
    prepare(selection: any) {
      const { title, series, price } = selection;
      return {
        title,
        subtitle: `${series || "No Series"} - $${price?.toFixed(2) || "0.00"}/ft`,
      };
    },
  },
};

export default cableType;


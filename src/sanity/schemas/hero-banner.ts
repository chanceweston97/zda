const heroBanner = {
  name: "heroBanner",
  type: "document",
  title: "Hero Banner",
  fields: [
    {
      name: "name",
      title: "Banner Name",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      product: "product.name",
      image: "image",
    },
    prepare(selection: any) {
      const { product, image } = selection;
      return {
        title: product,
        media: image,
      };
    },
  },
};

export default heroBanner;

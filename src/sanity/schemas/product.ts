const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "blockContent",
    },
    {
      name: "shortDescription",
      title: "Short Description",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: { type: "category" },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "discountedPrice",
      title: "Price After Discount",
      type: "number",
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: "offers",
      title: "Offers",
      type: "array",
      of: [
        {
          type: "string",
          title: "Offer",
        },
      ],
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
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "string",
          title: "Tag",
          validation: (Rule: any) =>
            Rule.custom((fields: any) => {
              if (
                fields !== fields.toLowerCase() ||
                fields.split(" ").includes("")
              ) {
                return "Tags must be lowercase and not be included space";
              }
              return true;
            }),
        },
      ],
    },
    {
      name: "colors",
      title: "Colors",
      type: "array",
      of: [
        {
          type: "string",
          title: "Color",
          validation: (Rule: any) =>
            Rule.custom((fields: any) => {
              if (
                fields !== fields.toLowerCase() ||
                fields.split(" ").includes("")
              ) {
                return "Colors must be lowercase and not be included space";
              }
              return true;
            }),
        },
      ],
    },

    {
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [
        {
          type: "string",
          title: "Size",
          validation: (Rule: any) =>
            Rule.custom((fields: any) => {
              if (
                fields !== fields.toLowerCase() ||
                fields.split(" ").includes("")
              ) {
                return "size must be lowercase and not be included space";
              }
              return true;
            }),
        },
      ],
    },
    {
      name: "customAttributes",
      title: "Custom Attributes",
      type: "array",
      of: [
        {
          type: "object",
          name: "customAttribute",
          title: "Custom Attribute",
          fields: [
            {
              name: "attributeName",
              title: "Attribute Name",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "attributeValues",
              title: "Attribute Values",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "attributeValue",
                  title: "Attribute Value",
                  fields: [
                    {
                      name: "id",
                      title: "ID",
                      type: "string",
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: "title",
                      title: "Title",
                      type: "string",
                      validation: (Rule: any) => Rule.required(),
                    },
                  ],
                  preview: {
                    select: {
                      title: "title",
                      subtitle: "id",
                    },
                  },
                },
              ],
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "attributeName",
              subtitle: "attributeValues.0.title",
            },
          },
        },
      ],
    },

    {
      name: "additionalInformation",
      title: "Additional Information",
      type: "array",
      of: [
        {
          type: "object",
          name: "additionalInfo",
          title: "Additional Info",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "description",
            },
          },
        },
      ],
    },
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
      name: "body",
      title: "Body",
      type: "blockContent",
    },
  ],
  preview: {
    select: {
      title: "name",
      description: "shortDescription",
      category: "category.title",
      media: "thumbnails.0.image",
    },
    prepare(selection: any) {
      const { description, category, media } = selection;
      return {
        title: selection.title,
        subtitle: category,
        media,
      };
    },
  },
};
export default product;

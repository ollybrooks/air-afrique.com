import { baseLanguage } from "./localeStringType";

const general = {
  name: "general",
  title: "General",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "description",
      title: "Description",
      type: "string"
    },
    {
      name: "keywords",
      title: "Keywords",
      type: "string"
    },
    {
      name: "shareImage",
      title: "Share Image",
      type: "image"
    },
    {
      name: "menuItems",
      type: "array",
      title: "Menu Items",
      validation: (Rule: any) => Rule.min(3).max(3).unique().error('You must have exactly 3 menu items'),
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              type: "string",
              title: "Menu Type",
              options: {
                list: [
                  { title: "Shop", value: "shop" },
                  { title: "Editorial", value: "editorial" },
                  { title: "About", value: "about" },
                ]
              }
            },
            {
              name: "image",
              type: "image",
              title: "Image"
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: `title.${baseLanguage?.id}`
    }
  }
}

export default general;

const museum = {
  name: "museum",
  title: "Museum",
  type: "document",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
    },
    {
      name: "credits",
      title: "Credits",
      type: "localeString",
    },
    {
      name: "description",
      title: "Description",
      type: "localeText",
    }
  ],
  preview: {
    select: {
      title: "description.fr",
      media: "image",
    },
  },
}

export default museum;
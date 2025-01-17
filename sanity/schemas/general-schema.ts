import { baseLanguage } from "./localeStringType";

const general = {
  name: "general",
  title: "General",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "localeString"
    },
    {
      name: "description",
      title: "Description",
      type: "localeString"
    }
  ],
  preview: {
    select: {
      title: `title.${baseLanguage?.id}`
    }
  }
}

export default general;

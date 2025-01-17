import { baseLanguage } from "./localeStringType";

const about = {
  name: "about",
  title: "About",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "content",
      title: "Content",
      type: "localeBlock"
    },
    {
      name: "team",
      title: "Team", 
      type: "array",
      of: [{
        type: "object",
        fields: [
          {
            name: "name",
            title: "Name",
            type: "string"
          },
          {
            name: "title",
            title: "Title",
            type: "string"
          },
          {
            name: "link",
            title: "Link",
            type: "url"
          }
        ]
      }]
    }
  ],
}

export default about;
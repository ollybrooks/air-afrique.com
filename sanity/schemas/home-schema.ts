const home = {
  name: "home",
  type: "document",
  title: "Home",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "images",
      type: "array",
      description: "Images to display in the pre-loader",
      title: "Images",
      of: [{ type: "image" }],
    }
  ],
};

export default home;

const article = {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.fr',
        slugify: (input: string) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      name: 'credits',
      title: 'Credits',
      type: 'localeString',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'localeBlock',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'image',
            title: 'Image',
            type: 'image'
          },
          {
            name: 'caption',
            title: 'Caption',
            type: 'localeString'
          }
        ],
        preview: {
          select: {
            title: 'caption.fr',
            media: 'image',
          },
        },
      }]
    },
  ],
  preview: {
    select: {
      title: 'title.fr',
      media: 'images.0.image',
    },
  },
}

export default article;
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
      description: 'The url the article will be accessible at',
      type: 'slug',
      options: {
        source: 'title.fr',
        slugify: (input: string) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      name: 'type',
      title: 'Type',
      description: 'The type of the article, either text or image focused',
      type: 'string',
      options: {
        list: [
          {title: 'Text', value: 'text'},
          {title: 'Image', value: 'image'},
        ]
      },
      initialValue: 'text'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      initialValue: new Date().toISOString().split('T')[0]
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'localeText',
    },
    {
      name: 'credits',
      title: 'Credits',
      type: 'localeText',
    },
    {
      name: 'background',
      title: 'Background', 
      description: 'The background color of the article',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Green', value: 'green'}, 
          {title: 'Red', value: 'red'},
          {title: 'Yellow', value: 'yellow'}
        ]
      },
      initialValue: 'default'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'localeBlock',
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
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
            type: 'string'
          }
        ],
        preview: {
          select: {
            title: 'caption',
            media: 'image',
          },
        },
      }]
    },
  ],
  preview: {
    select: {
      title: 'title.fr',
      media: 'heroImage',
    },
    prepare(selection: any) {
      const {title} = selection
      return {
        title: title,
        media: selection.media
      }
    }
  },
}

export default article;
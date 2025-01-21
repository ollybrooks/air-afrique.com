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
      name: 'hero',
      title: 'Hero',
      type: 'boolean',
      initialValue: false
    },
    // DATE
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
      subtitle: 'hero',
      media: 'heroImage',
    },
    prepare(selection: any) {
      const {title, subtitle} = selection
      return {
        title: subtitle ? `[HERO] ${title}` : title,
        media: selection.media
      }
    }
  },
  document: {
    actions: (prev: any, context: any) => {
      const defaultActions = prev.filter(({ action }: { action: any }) => action !== 'publish')
      
      return [
        ...defaultActions,
        {
          label: 'Publish',
          action: async (props: any) => {
            // First check if this document is being set as hero
            if (props.draft?.hero) {
              const {documentStore} = context

              // Query both published and draft documents that are heroes
              const query = '*[_type == "article" && hero == true && _id != $id && !(_id in path("drafts.**"))]'
              const heroArticles = await documentStore.client.fetch(query, { id: props.draft._id })
              
              const tx = props.createTransaction()

              // Update each hero article and its draft
              for (const doc of heroArticles) {
                // Update the published document
                tx.patch(doc._id, (patch: any) => patch.set({hero: false}))
                
                // Update the draft version if it exists
                tx.patch(`drafts.${doc._id}`, (patch: any) => patch.set({hero: false}))
                
                // Also publish the changes
                tx.publish(doc._id)
              }

              await tx.commit()
            }
            
            return props.publish()
          }
        }
      ]
    }
  }
}

export default article;
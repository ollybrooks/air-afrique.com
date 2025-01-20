import { client } from "@/sanity/utils"

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
      subtitle: 'hero',
      media: 'heroImage',
    },
    prepare(selection: any) {
      const {title, subtitle} = selection
      return {
        title: subtitle ? `${title} (Hero)` : title,
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
              // Unset other heroes first
              const query = '*[_type == "article" && hero == true && _id != $id]'
              const heroArticles = await client.fetch(query, { id: props.draft._id })
              
              // Update all found hero articles
              await Promise.all(heroArticles.map(async (doc: any) => {
                // Update published version
                await client.patch(doc._id)
                  .set({ hero: false })
                  .commit()
                
                // Check and update draft version
                const draftId = `drafts.${doc._id}`
                const draftExists = await client.fetch(`*[_id == $id][0]`, { id: draftId })
                if (draftExists) {
                  await client.patch(draftId)
                    .set({ hero: false })
                    .commit()
                }
              }))
            }
            
            // Then proceed with normal publish
            await client.patch(props.draft._id).commit()
            return props.publish()
          }
        }
      ]
    }
  }
}

export default article;
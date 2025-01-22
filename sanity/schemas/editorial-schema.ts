const editorial = {
  name: 'editorial',
  title: 'Editorial',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'heroArticle',
      title: 'Hero Article',
      type: 'reference',
      to: [{ type: 'article' }]
    }
  ]
}

export default editorial
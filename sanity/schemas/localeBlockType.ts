import {defineType, defineField} from 'sanity'

const supportedLanguages = [
  { id: 'fr', title: 'French', isDefault: true },
  { id: 'en', title: 'English' },
]

export const baseLanguage = supportedLanguages.find(l => l.isDefault)

export const localeBlock = defineType({
  title: 'Localized Rich Text',
  name: 'localeBlock',
  type: 'object',
  fields: supportedLanguages.map(lang => defineField({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: [{type: 'block'}]
  }))
})

export default localeBlock
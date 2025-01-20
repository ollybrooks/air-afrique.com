import {defineType, defineField} from 'sanity'

const supportedLanguages = [
  { id: 'fr', title: 'French', isDefault: true },
  { id: 'en', title: 'English' },
]

export const baseLanguage = supportedLanguages.find(l => l.isDefault)

export default defineType({
  name: 'localeText',
  type: 'object',
  fields: supportedLanguages.map(lang => defineField({
    name: lang.id,
    title: lang.title,
    type: 'text',
    // initialValue: lang.isDefault ? 'fr' : undefined
  }))
})

export const localeText = defineType({
  title: 'Localized text',
  name: 'localeText', 
  type: 'object',
  // Fieldsets can be used to group object fields.
  // Here we omit a fieldset for the "default language",
  // making it stand out as the main field.
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: true }
    }
  ],
  // Dynamically define one field per language
  fields: supportedLanguages.map(lang => ({
    title: lang.title,
    name: lang.id,
    type: 'text',
    fieldset: lang.isDefault ? undefined : 'translations'
  }))
})
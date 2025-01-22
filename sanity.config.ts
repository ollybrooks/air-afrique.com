import { defineConfig } from 'sanity';
import {structureTool} from 'sanity/structure'
// import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import schemas from '@/sanity/schemas';
import { AsteriskIcon, DocumentIcon } from '@sanity/icons';

const singletonActions = new Set(['publish', 'discardChanges', 'restore']);
const singletonTypes = new Set(['general', 'home', 'about', 'editorial', 'additional']);

const config = defineConfig({
  projectId: "36cwc4ht",
  dataset: "production",
  title: "Air Afrique",
  apiVersion: "2023-07-10",
  basePath: "/admin",
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('General')
              .id('general')
              .icon(AsteriskIcon)
              .child(
                S.document()
                  .schemaType('general')
                  .documentId('general')
              ),
            S.listItem()
              .title('Home')
              .id('home')
              .icon(DocumentIcon)
              .child(
                S.document()
                  .schemaType('home')
                  .documentId('home')
              ),
            S.listItem()
              .title('About')
              .id('about')
              .icon(DocumentIcon)
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about')
              ),
            S.listItem()
              .title('Editorial')
              .id('editorial')
              .icon(DocumentIcon)
              .child(
                S.document()
                  .schemaType('editorial')
                  .documentId('editorial')
              ),
            S.listItem()
              .title('Additional Pages')
              .id('additional')
              .icon(DocumentIcon)
              .child(
                S.document()
                  .schemaType('additional')
                  .documentId('additional')
              ),
            ...S.documentTypeListItems().filter(listItem => {
              const id = listItem.getId();
              if (!id) return false;
              return !singletonTypes.has(id)
            })
          ]),
    }),
  ],
  schema: {
    types: schemas,
    templates: (templates) => templates.filter((template) => !singletonTypes.has(template.schemaType))
  },
  document: {
    actions: (input, context) => {
      // Handle singleton actions only
      return singletonActions.has(context.schemaType) 
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input
    }
  }
})

export default config
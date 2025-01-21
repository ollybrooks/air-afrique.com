import { createClient, groq } from "next-sanity";

export const client = createClient({
  projectId: "36cwc4ht",
  dataset: "production",
  apiVersion: "2023-07-10",
  useCdn: false
})

export const getGeneral = async (locale: string) => {
  return client.fetch(
    groq`*[_type == "general"][0]{
      _updatedAt,
      _id,
      "title": coalesce(title[$locale], title.fr),
      "description": coalesce(description[$locale], description.fr)
    }`,
    { locale }
  )
}

export const getAbout = async (locale: string) => {
  return client.fetch(
    groq`*[_type == "about"][0]{
      _updatedAt,
      _id,
      title,
      "content": coalesce(content[$locale], content.fr),
      team
    }`,
    { locale }
  )
}

export const getAdditional = async (locale: string) => {
  return client.fetch(
    groq`*[_type == "additional"][0]{
      _updatedAt,
      _id,
      title,
      "shippingAndReturns": coalesce(shippingAndReturns[$locale], shippingAndReturns.fr),
      "termsAndConditions": coalesce(termsAndConditions[$locale], termsAndConditions.fr),
      "privacyPolicy": coalesce(privacyPolicy[$locale], privacyPolicy.fr)
    }`,
    { locale }
  )
}

export const getArticles = async (locale: string) => {
  return client.fetch(
    groq`*[_type == "article"]{
      _updatedAt,
      _id,
      "title": coalesce(title[$locale], title.fr),
      "description": coalesce(description[$locale], description.fr),
      "content": coalesce(content[$locale], content.fr),
      "heroImage": heroImage.asset->url,
      "images": images[]{
        "url": image.asset->url,
        caption
      },
      "slug": slug.current,
      "credits": coalesce(credits[$locale], credits.fr),
      "summary": coalesce(summary[$locale], summary.fr),
      background,
      type,
      hero
    }`,
    { locale }
  )
}
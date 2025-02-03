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
      title,
      description,
      keywords,
      "shareImage": shareImage.asset->url,
      "menuItems": menuItems[]{
        type,
        "image": image.asset->url
      }
    }`,
    { locale }
  )
}

export const getHome = async () => {
  return client.fetch(
    groq`*[_type == "home"][0]{
      _updatedAt,
      _id,
      "images": images[]{
        "url": asset->url,
      }
    }`
  )
}

export const getAbout = async (locale: string) => {
  return client.fetch(
    groq`*[_type == "about"][0]{
      _updatedAt,
      _id,
      title,
      "content": coalesce(content[$locale], content.fr),
      team,
      "images": images[]{
        "url": asset->url,
      }
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
      date,
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

export const getEditorial = async () => {
  return client.fetch(
    groq`*[_type == "editorial"][0]{
      _updatedAt,
      _id,
      title,
      heroArticle
    }`
  )
}
export const getMuseum = async (locale: string) => {
  return client.fetch(
    groq`*[_type == "museum"]{
      _id,
      "image": image.asset->url,
      "credits": coalesce(credits[$locale], credits.fr),
      "description": coalesce(description[$locale], description.fr)
    }`,
    { locale }
  )
}
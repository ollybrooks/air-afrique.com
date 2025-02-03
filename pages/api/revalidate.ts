import { NextApiRequest, NextApiResponse } from 'next';
import { SIGNATURE_HEADER_NAME, isValidSignature } from '@sanity/webhook';
import { createClient } from 'next-sanity';
import client from '@/shopify/client'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function readBody(readable: any) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const body = await readBody(req)
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!(await isValidSignature(body, signature, secret!))) {
    res.status(401).json({success: false, message: 'Invalid signature'})
    return
  }

  const sanityClient = createClient({ 
    projectId: "36cwc4ht",
    dataset: "production",
    apiVersion: "2023-07-10", 
    useCdn: false 
  })

  const jsonBody = JSON.parse(body)
  const articles = await sanityClient.fetch(`*[_type == "article"]`)
  const products = await client.product.fetchAll()
  const routes = [
    "/", 
    "/about",
    "/editorial",
    "/shop",
    "/privacy",
    "/shipping",
    "/terms",
    ...articles.map((article: any) => `/editorial/${article.slug.current}`),
    ...products.map((product: any) => `/shop/${product.handle}`)
  ]

  // Create localized versions of all routes
  // French (default locale) doesn't need prefix, only English routes need /en
  const localizedRoutes = routes.flatMap(route => [
    route,           // French version (default)
    `/en${route}`    // English version
  ])

  await Promise.all(localizedRoutes.map((route) => res.revalidate(route)))
  res.status(200).json({ message: "Updated routes", revalidated: localizedRoutes })
}

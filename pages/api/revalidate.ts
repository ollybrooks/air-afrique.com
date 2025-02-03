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

  try {
    const sanityClient = createClient({ 
      projectId: "36cwc4ht",
      dataset: "production",
      apiVersion: "2023-07-10", 
      useCdn: false 
    })

    // Parse the webhook body to get the updated document
    const jsonBody = JSON.parse(body)
    const isDelete = jsonBody.operation === 'delete'
    
    // Add a small delay to ensure Sanity has processed the change
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Handle deletion specifically
    if (isDelete && jsonBody.documentId) {
      // For deleted articles, we'll force a revalidation of the editorial pages
      // which will trigger getStaticProps to return notFound: true
      const deletedRoutes = [
        `/editorial`,
        `/en/editorial`,
      ]
      
      await Promise.all(
        deletedRoutes.map(async (route) => {
          try {
            await res.revalidate(route)
            console.log(`Revalidated ${route} after deletion`)
          } catch (error) {
            console.error(`Failed to revalidate ${route}:`, error)
          }
        })
      )

      return res.status(200).json({ 
        message: "Handled deletion", 
        revalidated: deletedRoutes
      })
    }
    
    // Handle updates and creations as before
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
    const localizedRoutes = routes.flatMap(route => [
      route,
      `/en${route}`
    ])

    await Promise.all(
      localizedRoutes.map(async (route) => {
        try {
          await res.revalidate(route)
        } catch (error) {
          console.error(`Failed to revalidate ${route}:`, error)
        }
      })
    )

    res.status(200).json({ 
      message: "Updated routes", 
      revalidated: localizedRoutes,
      articleCount: articles.length 
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return res.status(500).json({ 
      message: "Error revalidating", 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

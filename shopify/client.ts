import Client from 'shopify-buy'

const client = Client.buildClient({
  domain: process.env.SHOPIFY_STORE_URL as string,
  storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
  apiVersion: "2023-07"
})

export default client
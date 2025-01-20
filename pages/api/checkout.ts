import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { lineItems } = req.body;

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return res.status(400).json({ message: 'Invalid or missing items' });
  }

  try {
    console.log('Attempting to create checkout with line items:', lineItems);

    const createCartMutation = `
      mutation cartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            checkoutUrl
          }
          userErrors {
            code
            field
            message
          }
        }
      }
    `;

    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_URL}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
        },
        body: JSON.stringify({
          query: createCartMutation,
          variables: {
            lines: lineItems.map((item: any) => ({
              merchandiseId: item.variantId,
              quantity: item.quantity,
            })),
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Shopify API response not OK:', {
        status: response.status,
        statusText: response.statusText,
        body: await response.text(),
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data, errors } = await response.json();
    
    console.log('Shopify API response:', { data, errors });

    if (errors) {
      throw new Error(errors[0].message);
    }

    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }

    res.status(200).json({ checkoutUrl: data.cartCreate.cart.checkoutUrl });
  } catch (error: any) {
    console.error('Detailed error creating checkout:', {
      error: error.message,
      stack: error.stack,
      lineItems,
      shopifyUrl: process.env.SHOPIFY_STORE_URL,
      // Don't log the actual token, just check if it exists
      hasToken: !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    });
    res.status(500).json({ 
      message: 'Error creating checkout', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

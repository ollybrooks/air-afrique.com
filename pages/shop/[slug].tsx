import Layout from "@/components/Layout";
import { GetStaticProps, GetStaticPaths } from 'next';
import client from '@/shopify/client';

// Add types for the product
interface ProductPageProps {
  product: {
    title: string;
    description: string;
    descriptionHtml: string;
    images: { src: string }[];
    variants: { price: { amount: string } }[];
  };
}

export default function ProductPage({ product }: ProductPageProps) {
  return(
    <Layout>
      <div className="page">
        <div className="pt-24">
          <div 
            className="font-medium"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
        <div className="flex flex-col justify-center gap-24 overflow-y-scroll">
          {product.images.map((image, index) => (
            <img key={index} src={image.src} alt={product.title} />
          ))}
        </div>
        <div className="h-full flex flex-col justify-center gap-4">
          <div className="text-4xl font-medium w-full">
            <div>{product.title}</div>
            <div>€{product.variants[0]?.price.amount}</div>
          </div>
          <button className="serif w-full border-y border-black py-2 text-3xl font-bold">
            Add To Cart
          </button>
        </div>
      </div>
    </Layout>
  )
}

// Add getStaticPaths to generate paths for all products
export const getStaticPaths: GetStaticPaths = async () => {
  const products = await client.product.fetchAll();
  
  // Create paths for both locales but using the same product data
  const paths = products.flatMap((product: any) => [
    {
      params: { 
        slug: product.handle,
      },
      locale: 'en'
    },
    {
      params: { 
        slug: product.handle,
      },
      locale: 'fr'
    }
  ]);

  return {
    paths,
    fallback: false,
  };
};

// Add getStaticProps to fetch product data
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }

  const products = await client.product.fetchAll();
  const product = products.find((p: any) => p.handle === params.slug);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
};
import Layout from "@/components/Layout";
import { GetStaticProps, GetStaticPaths } from 'next';
import client from '@/shopify/client';
import { getGeneral } from "@/sanity/utils";
import { useCart } from "@/context/cart";
import { useState } from "react";

// Add types for the product
interface ProductPageProps {
  product: any;
  general: any;
}

export default function ProductPage({ product, general }: ProductPageProps) {

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const handleVariant = (variant: any) => {
    setSelectedVariant(variant);
    setAdded(false);
  }

  return(
    <Layout metadata={general}>
      <div className="page">
        <div className="md:pt-24">
          <div 
            className="font-medium p-4 md:p-0"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
        <div className="flex flex-col justify-center gap-24 overflow-y-scroll">
          {product.images.map((image: any, index: any) => (
            <img key={index} src={image.src} alt={product.title} />
          ))}
        </div>
        <div className="md:h-full flex flex-col justify-center md:gap-4 fixed md:relative bottom-0 left-0 w-full md:w-auto border-t border-black md:border-t-0 bg-white md:bg-transparent">
          <div className="text-2xl md:text-4xl font-medium w-full p-4 md:p-0">
            <div>{product.title}</div>
            <div>€{Number(product.variants[0]?.price.amount).toFixed(2)}</div>
          </div>
          {product.variants.length > 1 && (
            <div className="w-full flex justify-between serif text-[28px] font-bold md:mt-4 px-4 md:p-0">
              {product.variants.map((variant: any) => (
                <button key={variant.id} onClick={() => handleVariant(variant)}>{variant.title}</button>
              ))}
            </div>
          )}
          <button 
            className="serif w-full border-t md:border-y border-black py-2 text-2xl md:text-3xl font-bold" 
            onClick={() => {
              addItem(product)
              setAdded(true)
            }}
          >
            {added ? "Added" : "Add To Cart"}
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
export const getStaticProps: GetStaticProps = async (context: any) => {
  const { params } = context;

  if (!params?.slug) {
    return {
      notFound: true,
    };
  }
  
  const { locale } = context;
  const general = await getGeneral(locale);

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
      general,
    },
    revalidate: 60
  };
};
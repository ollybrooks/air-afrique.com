import Layout from "@/components/Layout";
import { GetStaticProps, GetStaticPaths } from 'next';
import client from '@/shopify/client';
import { getGeneral } from "@/sanity/utils";
import { useCart } from "@/context/cart";
import { useEffect, useState } from "react";

// Add types for the product
interface ProductPageProps {
  product: any;
  general: any;
}

export default function ProductPage({ product, general }: ProductPageProps) {

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleVariant = (variant: any) => {
    setSelectedVariant(variant);
    setAdded(false);
  }

  useEffect(() => {
    if (added) {
      const timeout = setTimeout(() => {
        setAdded(false);
        setIsCartOpen(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [added]);

  return(
    <Layout metadata={general} setCartOpen={isCartOpen}>
      <div className="page">
        <div className="min-h-screen flex items-center">
          <div className="overflow-y-auto max-h-screen md:pt-24">
            <div 
              className="font-medium p-4 md:p-0"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
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
            className="serif w-full border-t md:border-y bg-white border-black py-2 text-2xl md:text-3xl font-bold relative group overflow-hidden" 
            onClick={() => {
              addItem(product);
              setAdded(true);
              setIsCartOpen(true);
            }}
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-500 ease-in-out">
              {added ? "Added" : "Add To Cart"}
            </span>
            <div className="absolute inset-0 bg-black w-full h-full -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
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
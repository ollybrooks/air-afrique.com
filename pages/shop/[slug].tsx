import Layout from "@/components/Layout";
import { GetStaticProps, GetStaticPaths } from 'next';
import client from '@/shopify/client';
import { getGeneral } from "@/sanity/utils";
import { useCart } from "@/context/cart";
import { useEffect, useState } from "react";
import Image from "next/image";

// Add types for the product
interface ProductPageProps {
  product: any;
  general: any;
}

export default function ProductPage({ product, general }: ProductPageProps) {

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    // Select first available variant, or first variant if none available
    product.variants.find((v: any) => v.available) || product.variants[0]
  );
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

  const [current, setCurrent] = useState(0);

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      variantId: selectedVariant.id,
      quantity: 1,
      title: product.title,
      price: selectedVariant.price.amount,
      image: product.images[0]?.src,
      variants: product.variants,
      images: product.images
    };
    
    addItem(cartItem);
    setAdded(true);
    setIsCartOpen(true);
  };

  const isOutOfStock = product.variants.every((v: any) => !v.available);
  const isSelectedVariantAvailable = selectedVariant.available;

  return(
    <Layout metadata={general} setCartOpen={isCartOpen}>
      <div className="page" style={{ height: "100dvh"}}>
        <div className="absolute left-0 bottom-0 w-full h-[45%] md:h-auto md:min-h-screen md:relative p-2 md:px-0 md:py-24 overflow-y-scroll md:flex md:items-center">
          <div 
            className="text-sm md:text-base font-medium p-2 md:p-0"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
        <div 
          // ref={imagesContainerRef} 
          className="fixed top-0 left-0 w-full h-[55%] md:h-auto md:relative flex flex-col justify-start items-center md:py-24 overflow-y-hidden md:overflow-y-scroll bg-white border-b border-black md:border-b-0"
        >
          {product.images.map((image: any, index: any) => (
            <div 
              key={index} 
              className={`absolute md:relative w-full h-full p-4 pt-20 md:p-0 flex flex-col items-end md:pt-0 ${index === current ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}
              onClick={() => setCurrent(current === product.images.length - 1 ? 0 : current + 1)}
            >
              <Image 
                key={index} 
                src={image.src}
                alt={product.title} 
                width={1200} 
                height={800} 
                className="w-full h-full aspect-square object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        <div className="md:h-full flex flex-col justify-center md:gap-4 fixed md:relative bottom-0 left-0 w-full md:w-auto border-t border-black md:border-t-0 bg-white md:bg-transparent">
          <div className="text-xl md:text-4xl font-medium w-full px-4 py-2 md:p-0">
            <div>{product.title}</div>
            <div>€{Number(selectedVariant.price.amount).toFixed(2)}</div>
          </div>
          {product.variants.length > 1 && (
            <div className="w-[calc(100%+32px)] flex justify-between serif text-xl md:text-[28px] font-bold -ml-4 mb-2 md:-mb-4 md:mt-0 px-4 md:p-0">
              {product.variants.map((variant: any) => (
                <button 
                  key={variant.id} 
                  onClick={() => handleVariant(variant)} 
                  className={`p-4 md:p-4 px-4 py-1 md:py-4 ${selectedVariant.id === variant.id ? 'underline' : ''} ${
                    !variant.available ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!variant.available}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          )}
          <button 
            className={`serif w-full border-t md:border-y bg-white border-black py-2 text-2xl md:text-3xl font-bold relative group overflow-hidden ${
              !isSelectedVariantAvailable ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            }`}
            onClick={handleAddToCart}
            disabled={!isSelectedVariantAvailable}
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-500 ease-in-out">
              {added ? "Added" : isOutOfStock ? "Out of Stock" : "Add To Cart"}
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
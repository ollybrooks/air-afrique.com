import Layout from "@/components/Layout";
import { getGeneral, getMuseum } from "@/sanity/utils";
import client from "@/shopify/client";
import Link from "next/link";
import Image from "next/image";
import Interlude from "@/components/Interlude";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function Shop({ products, general, museum }: { products: any[], general: any, museum: any }) {
  const router = useRouter();
  const [showInterlude, setShowInterlude] = useState(false);
  const [pendingRoute, setPendingRoute] = useState('');
  const [museumContent, setMuseumContent] = useState<any>(null);

  const handleInterludeComplete = () => {
    // setShowInterlude(false);
    if (pendingRoute) {
      router.push(pendingRoute);
    }
  };

  const handleItemClick = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    setPendingRoute(`/shop/${handle}`);
    setShowInterlude(true);
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * museum.length);
    setMuseumContent(museum[randomIndex]);
  }, [museum]);

  console.log(products);

  return(
    <Layout metadata={general}>
      <div className={`shop`}>
        {products.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).map((item, index) => (
          <Link 
            key={index} 
            href={`/shop/${item.handle}`} 
            className="shop-item"
            onClick={(e) => handleItemClick(e, item.handle)}
          >
            <Image 
              src={item.images[0].src} 
              alt={item.title} 
              className="aspect-square object-cover" 
              width={960}
              height={960}
            />
            <div className="flex justify-between mt-1 font-medium">
              <p>{item.title}</p>
              <p>€{Number(item.variants[0].price.amount).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>

      <Interlude 
        visible={showInterlude} 
        onComplete={handleInterludeComplete} 
        content={museumContent} 
      />
    </Layout>
  );
}

export async function getStaticProps(context: any) {
  const { locale } = context;
  const general = await getGeneral(locale);
  const products = await client.product.fetchAll();
  const museum = await getMuseum(locale);
  return {
    props: { 
      general,
      museum,
      products: JSON.parse(JSON.stringify(products))
    },
    revalidate: 60
  };
}
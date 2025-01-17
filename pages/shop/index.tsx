import Layout from "@/components/Layout";
import client from "@/shopify/client";
import Link from "next/link";

export default function Shop({ products }: { products: any[] }) {

  console.log(products);

  const data = [
    {
      title: "Issue 1",
      price: "10.00",
      image: "/example.png"
    },
    {
      title: "Issue 2",
      price: "10.00",
      image: "/example.png"
    },
    {
      title: "T-shirt 1",
      price: "30.00",
      image: "/example.png"
    },
  ]

  return(
    <Layout>
      <div className="shop">
        {products.map((item, index) => (
          <Link 
            key={index} 
            href={`/shop/${item.handle}`} 
            className="shop-item"
          >
            <img src={item.images[0].src} alt={item.title} className="aspect-square object-cover" />
            <div className="flex justify-between mt-1 font-medium">
              <p>{item.title}</p>
              <p>€{item.variants[0].price.amount}</p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const products = await client.product.fetchAll();

  return {
    props: { 
      products: JSON.parse(JSON.stringify(products))
    }
  };
}
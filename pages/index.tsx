import DevPanel from "@/components/DevPanel";
import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import MenuSection from "@/components/sections/Menu";
import { getGeneral } from "@/sanity/utils";
import { useRouter } from "next/router";

export default function Home({ general, products }: { general: any, products?: any }) {

  return (
    <Layout>
      <Loader/>
      <MenuSection />
    </Layout>
  );
}

export const getStaticProps = async (context: any) => {
  const { locale } = context;

  const general = await getGeneral(locale);

  return {
    props: { general },
    revalidate: 60,
  }
}
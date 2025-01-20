import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import MenuSection from "@/components/sections/Menu";
import { getGeneral } from "@/sanity/utils";

export default function Home({ general }: { general: any }) {
  return (
    <Layout metadata={general}>
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
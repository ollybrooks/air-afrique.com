import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import MenuSection from "@/components/sections/Menu";
import { getGeneral, getHome } from "@/sanity/utils";

export default function Home({ general, home }: { general: any, home: any }) {
  return (
    <Layout metadata={general}>
      {/* <Loader images={home.images}/> */}
      <MenuSection menuItems={general.menuItems} />
    </Layout>
  );
}

export const getStaticProps = async (context: any) => {
  const { locale } = context;
  const general = await getGeneral(locale);
  const home = await getHome();

  return {
    props: { general, home },
    revalidate: 60,
  }
}
import Layout from "@/components/Layout";
import { getAdditional, getGeneral } from "@/sanity/utils";
import { PortableText } from "@portabletext/react";

export default function Shipping({ data, general }: { data: any, general: any }) {
  return(
    <Layout metadata={general}>
      <div className="additional">
        <div>
          <PortableText value={data.shippingAndReturns} />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps(context: any) {
  const { locale } = context;
  const general = await getGeneral(locale);
  const data = await getAdditional(locale);
  return {
    props: { data, general },
    revalidate: 60
  };
}
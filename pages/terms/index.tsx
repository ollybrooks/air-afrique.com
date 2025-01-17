import Layout from "@/components/Layout";
import { getAdditional } from "@/sanity/utils";
import { PortableText } from "@portabletext/react";

export default function Terms({ data }: { data: any }) {
  return(
    <Layout>
      <div className="additional">
        <div>
          <PortableText value={data.termsAndConditions} />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps(context: any) {
  const { locale } = context;
  const data = await getAdditional(locale);
  return {
    props: { data },
  };
}
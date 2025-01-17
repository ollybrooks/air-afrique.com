import Head from "next/head";
import Nav from "./Nav";
import DevPanel from "./DevPanel";
import client from "@/sanity.config";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return(
    <>
      <Head>
        <title>Air Afrique</title>
      </Head>
      <main>
        <Nav />
        {children}
        {/* {process.env.NODE_ENV === 'development' && <DevPanel sanity={client} />} */}
      </main>
    </>
  );
}

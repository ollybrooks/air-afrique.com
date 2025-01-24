import Head from "next/head";
import Nav from "./Nav";

export default function Layout({ 
  metadata, 
  children,
  setCartOpen 
}: { 
  metadata: any, 
  children?: React.ReactNode,
  setCartOpen?: boolean
}) {

  return(
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="/og-image.jpg" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        {/* <meta name="twitter:image" content="/og-image.jpg" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Nav cartControl={setCartOpen} />
        {children}
      </main>
    </>
  );
}

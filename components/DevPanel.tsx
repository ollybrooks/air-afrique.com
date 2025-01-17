import { useRouter } from "next/router";

export default function DevPanel({ sanity, products }: { sanity?: any, products?: any }) {

  const router = useRouter();
  // const { pathname, locale } = router || {};

  // if (!pathname) return;

  return(
    <div className="fixed z-50 top-0 left-0 m-2 p-4 bg-gray-200 rounded font-mono text-sm">
      {/* <div>{pathname}</div><br/> */}
      {/* <div>{router.locale}</div><br/> */}
      <div className={`${sanity ? "text-green-600" : "text-red-600"}`}>{sanity ? "Sanity Connected" : "Sanity Disconnected"}</div>
      <div className={`${products ? "text-green-600" : "text-red-600"}`}>{products ? "Shopify Connected" : "Shopify Disconnected"}</div>
    </div>
  );
}
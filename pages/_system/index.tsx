import Head from "next/head";
import { useEffect, useState } from "react";

export default function System() {

  const [routes, setRoutes] = useState<string[]>([]);

  useEffect(() => {
    // Fetch routes when component mounts
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => setRoutes(data.routes));
  }, []);
  
  return(
    <>
      <Head>
        <title>System</title>
      </Head>
      <main className="p-4">
        <div className="flex flex-col gap-4">
          <div>/_system</div>
          <div>{routes.map((route) => <div key={route}>{route}</div>)}</div>
        </div>
      </main>
    </>
  );
}
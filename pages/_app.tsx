import { CartProvider } from "@/context/cart";
import { TimeProvider } from "@/context/time";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <CartProvider>
      <TimeProvider>
        <Component {...pageProps} />
      </TimeProvider>
    </CartProvider>
  );
}

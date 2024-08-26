import { HomeProvider } from "context/HomeContext";
import NoInternetConnection from "../component/noInternet/internet";
import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoInternetConnection>
      <HomeProvider>
        <Component {...pageProps} />
      </HomeProvider>
    </NoInternetConnection>
  );
}

import "styles/globals.css";
import "node_modules/github-markdown-css/github-markdown-dark.css";
import "node_modules/highlight.js/styles/github-dark.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

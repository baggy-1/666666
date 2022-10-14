import "styles/tw-base.css";
import "styles/globals.css";
import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark.css";
import type { AppProps } from "next/app";
import Layout from "components/layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

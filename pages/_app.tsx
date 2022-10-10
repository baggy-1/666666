import "styles/reset.css";
import "styles/globals.css";
import "node_modules/github-markdown-css/github-markdown-dark.css";
import "node_modules/highlight.js/styles/github-dark.css";
import "node_modules/pretendard/dist/web/static/pretendard.css";
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

import { Head, Html, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard-dynamic-subset.css?family=Pretendard+Variable|Pretendard|-apple-system|BlinkMacSystemFont|system-ui|Roboto|Helvetica+Neue|Segoe+UI|Apple+SD+Gothic+Neo|Noto+Sans+KR|Malgun+Gothic|Apple+Color+Emoji|Segoe+UI+Emoji|Segoe+UI+Symbol|sans-serif"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

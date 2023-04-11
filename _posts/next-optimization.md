---
categories:
  - dev
date: "2022-10-14"
description: "next.js에서 제공하는 font-optimization을 사용해보자"
tags:
  - font
  - next.js
  - pretendard
title: Next.js에서 제공하는 Font Optimization
public: false
---

# 폰트 최적화
> [next/font-optimization](https://nextjs.org/docs/basic-features/font-optimization)

#### Next.js는 다음 빌드 동안 글꼴 CSS를 `인라인화`함으로써 웹 글꼴 로딩을 최적화할 수 있도록 도와줍니다. 이 최적화를 통해 글꼴 선언 파일을 가져오기 위한 `추가 네트워크 왕복이 제거`됩니다. 따라서 `FCP`(First Contentful Paint) 및 `LCP`(Large Contentful Paint)가 `개선`됩니다.

next.js 변환 예시
## 
```typescript
// Before
<link
  href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
  rel="stylesheet"
/>

// After
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<style data-href="https://fonts.googleapis.com/css2?family=Inter&display=optional">
  @font-face{font-family:'Inter';font-style:normal...
</style>
```

### Custom Document
> 폰트 최적화를 하기 위해선 `_document.js`를 추가해야 한다

_document에 글꼴을 추가하는 것이 개별 페이지보다 선호됩니다.  
Next/head가 있는 단일 페이지에 글꼴을 추가할 때 Next.js에 포함된 글꼴 최적화는 클라이언트 측 페이지 간 탐색이나 스트리밍 사용 시 작동하지 않습니다.(next docs)

예시
```javascript
// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```
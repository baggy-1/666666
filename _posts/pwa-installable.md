---
categories:
  - dev
date: "2023-04-11"
description: "Next.js에서 next-pwa를 사용해 웹사이트를 PWA로 설치 가능하게 해보자"
tags:
  - next.js
  - pwa
  - next-pwa
title: "Next.js 프로젝트를 PWA로 설치 가능하게 하기"
public: true
---

# 결론부터
[next-pwa](https://github.com/shadowwalker/next-pwa#readme)의 가이드를 따라 구성하면 됩니다.

# 개요
간단한 뉴스 프로젝트는 모바일 유저를 타겟으로 기획된 프로젝트입니다.  
하지만 웹으로 구성되었기에 기존 사용자는 URL 주소를 입력하거나 따로 저장한 URL을 클릭하여 접속해야 했습니다.  
Web 기술이 발전하여 기존 웹 서비스를 모바일 기기에서 앱과 같이 사용할 수 있는 [PWA(프로그레시브 웹 앱)](https://web.dev/progressive-web-apps/)이 등장하였습니다.  
따라서, 간단한 뉴스에도 `PWA`를 적용하여 사용자의 접근성을 높이고자 하였습니다.

# 구성 순서
1. [`next-pwa`를 설치합니다.](#next-pwa를-설치합니다)
2. [`next.config.js`를 구성합니다.](#nextconfigjs를-구성합니다)
3. [`manifest.json`을 `public` 폴더에 구성합니다.](#manifestjson을-public-폴더에-구성합니다)
4. [`_document.tsx` 혹은 `_app.tsx` 등에 `meta`, `link`를 구성합니다.](#_documenttsx-혹은-_apptsx-등에-meta-link를-구성합니다)
5. [이제 `PWA`를 설치할 수 있습니다.](#pwa-구성-완료)

## `next-pwa`를 설치합니다.
```bash
yarn add next-pwa
```

## `next.config.js`를 구성합니다.
```typescript
const nextConfig = {
    ...
}

const withPWA = require('next-pwa')({
    dest: 'public',
});

module.exports = withPWA({
    ...nextConfig,
})
```

## `manifest.json`을 `public` 폴더에 구성합니다.
manifest에 적용할 아이콘은 [여기](https://maskable.app/editor)를 활용하시면 좋습니다.  

`manifest.json`

```json
{
  "name": "PWA App",
  "short_name": "App",
  "icons": [
    {
      "src": "/icons/maskable_icon_x48.png",
      "sizes": "48x48",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/maskable_icon_x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/maskable_icon_x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/maskable_icon_x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/maskable_icon_x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/maskable_icon_x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/maskable_icon_x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "theme_color": "#FFFFFF",
  "background_color": "#FFFFFF",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait"
}
```
|속성|설명|비고|
|---|---|---|
|name|앱이 설치될 때 사용됩니다.|  |
|short_name|홈 화면, 런처 등 기타 위치에서 사용됩니다.|  |
|icons|상황에 맞게 보여질 아이콘들을 정의합니다.|  |
|theme_color|작업도구의 색입니다.|  |
|background_color|실행 시 배경색입니다.|  |
|start_url|앱이 실행될 때, 시작 위치를 브라우저에게 알려줍니다.|  |
|display|앱 실행 시 브라우저 UI를 설정합니다.|*아래 참조(1)|
|orientation|기기의 방향입니다.|*아래 참조(2)|
|categories|앱의 카테고리 이름들을 정의합니다.| |
|description|앱의 설명입니다.| |  

### 비고  
(1)  
- fullscreen: 디스플레이 전체 영역을 사용합니다. (ex. 게임 앱)  
- standalone: 독립형 앱처럼 작동합니다. URL 표시줄과 같은 브라우저 영역은 숨겨집니다.
- minimal-ui: 최소한의 UI 요소만 제공합니다.
- browser: 표준 브라우저 환경입니다.  

(2)
- portrait: 가로
- landscape: 세로


## `_document.tsx` 혹은 `_app.tsx` 등에 `meta`, `link`를 구성합니다.
```typescript
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

```typescript
// manifest
<link rel="manifest" href="/manifest.json" />

// 아래부터는 SEO, PWA 최적화 등에 때문에 작성되면 좋은 것이지, 설치 가능과는 상관없습니다.(필수 아님)

// icons
<link rel="icon" href="/favicon.ico" />
<link rel="shortcut icon" href="/favicon.ico" />
<link
    rel="apple-touch-icon"
    sizes="57x57"
    href="/icons/apple-icon-57x57.png"
/>
<link
    rel="icon"
    type="image/png"
    sizes="16x16"
    href="/icons/favicon-16x16.png"
/>

// meta tag
<meta name="application-name" content={app} />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-name" content={app} />
<meta name="format-detection" content="telephone=no" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="msapplication-TileColor" content="#2B5797" />
<meta name="msapplication-tap-highlight" content="no" />
<meta name="theme-color" content="#000000" />
```

## `PWA` 구성 완료
### 자 이제 다 되었습니다!  
![pwa_installable](https://user-images.githubusercontent.com/84620459/231218181-cb3c2fb5-c767-4637-bfee-df96bba966a4.gif)
---
categories:
  - dev
date: "2022-10-12"
description: 매번 헷갈리는 emotion 세팅을 정리해봐요
tags:
  - emotion
  - next.js
  - typescript
title: emotion 초기 설정 (with next.js, typescript)
public: true
---

# 😵 emotion 초기 설정

> 프로젝트 마다 매번 까먹는 저를 위해 emotion 초기 설정을 정리해봤어요

## `emotion` 설치!

```bash
npm install --save @emotion/react
```

## `next.config.js` 설정

> [next.js/compiler](https://nextjs.org/docs/advanced-features/compiler#emotion)  
> [tistory/nuhends](https://nuhends.tistory.com/124)

```js
// next.config.js

const nextConfig = {
  //...
  compiler: {
    // emotion 관련 설정 기본 값
    emotion: true,
  },
};
```

```js
// next.js 공식 홈페이지의 설정 옵션 설명
// 추후, 필요할 때 사용해보기

// next.config.js

module.exports = {
  compiler: {
    emotion: boolean | {
      // default is true. It will be disabled when build type is production.
      sourceMap?: boolean,
      // default is 'dev-only'.
      autoLabel?: 'never' | 'dev-only' | 'always',
      // default is '[local]'.
      // Allowed values: `[local]` `[filename]` and `[dirname]`
      // This option only works when autoLabel is set to 'dev-only' or 'always'.
      // It allows you to define the format of the resulting label.
      // The format is defined via string where variable parts are enclosed in square brackets [].
      // For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
      labelFormat?: string,
    },
  },
}
```

## `tsconfig.json` 설정

> [emotion/typescript](https://emotion.sh/docs/typescript)  
> [typescript/jsx](https://www.typescriptlang.org/ko/docs/handbook/jsx.html)

```json
// tsconfig.json

{
  "compilerOptions": {
    //...
    // emotion doc에서는 "jsx": "react-jsx"를 사용했는데,
    // "preserve"로 사용해도 괜찮음
    // 관련 doc
    // emotion: https://emotion.sh/docs/typescript
    // ts: https://www.typescriptlang.org/ko/docs/handbook/jsx.html
    // next.js: https://nextjs.org/docs/messages/react-hydration-error
    "jsx": "preserve",
    "jsxImportSource": "@emotion/react" // 해당 설정을 하지 않으면 빌드 시 에러가 발생한다
  }
  //...
}
```

`jsxImportSource` 미 설정 시

```bash
# Failed to compile.

Type error: Type '{ children: Element; key: string; css: SerializedStyles; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.

Property 'css' does not exist on type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
```

#### 참고 tsconfig.json `jsx`

| 모드      | 입력      | 출력                       | 확장자 |
| --------- | --------- | -------------------------- | ------ |
| preserve  | `<div />` | `<div />`                  | .jsx   |
| react-jsx | `<div />` | `_jsx("div", {}, void 0);` | .js    |

> 두 가지 설정을 마쳤다면 `css prop`을 사용 가능해요
> 하지만 저는 reset css를 추가하려 해요

## 🎨 `tailwindCSS reset css` 적용
> `tailwindCSS`를 먼저 사용했어서, 익숙한 tailwindCSS reset css를 사용해요  
> 추가적으로 :root {overflow-wrap:break-word;word-break:break-word;}도 사용해요  
> `teo`님의 [포스트](https://velog.io/@teo/2022-CSS-Reset-%EB%8B%A4%EC%8B%9C-%EC%8D%A8%EB%B3%B4%EA%B8%B0)를 참고했어요 감사합니다👍

```css
/* tw-base.css */

a,hr{color:inherit}progress,sub,sup{vertical-align:baseline}blockquote,body,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,menu,ol,p,pre,ul{margin:0}fieldset,legend,menu,ol,ul{padding:0}*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:theme("borderColor.DEFAULT", "currentColor")}::after,::before{--tw-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:theme( "fontFamily.sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" )}body{line-height:inherit}hr{height:0;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:theme( "fontFamily.mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace );font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}menu,ol,ul{list-style:none}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:theme("colors.gray.4", #9ca3af)}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}:root{overflow-wrap:break-word;word-break:break-word}
```

```typescript
// _app.tsx

import "styles/tw-base.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <Component {...pageProps} />
  );
}

export default MyApp;
```
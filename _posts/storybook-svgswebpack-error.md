---
categories:
  - dev
date: "2023-04-12"
description: "@svgr/webpack과 Storybook을 함께 사용해봅시다."
tags:
  - next.js
  - storybook
  - error
  - svgr/webpack
title: "@svgr/webpack과 Storybook의 잘못된 만남"
public: true
---

# Storybook Build Error를 해결합니다.

## Storybook 빌드 후, 확인 시 나타나는 에러 내용
![image](https://user-images.githubusercontent.com/84620459/231258728-1513cb13-981b-469e-a65b-99417459079c.png)
> `react component`를 기대했는데 `object`가 나왔습니다,,,  
  
  
## 원인
`@svgr/webpack`을 사용할 때, `next.config.js`의 webpack 설정은 하였으나 storybook의 설정을 하지 않아 발생하였습니다.   
  
`@svgr/webpack`은 svg 파일을 react.component로서 사용할 수 있도록 해줍니다.  

해결하기 위해 `.storybook/main.js`에 아래와 같은 webpack 설정을 추가하였습니다.
```typescript
...

config.module.rules.push({
  test: /\.svg$/,
  use: ['@svgr/webpack'],
})

...
```
하지만 여전히 에러가 발생했고 원인은 다음과 같습니다.  
storybook 내부에서 기본적으로 svg규칙을 아래와 같이 구성하고 있었습니다. [참고](https://github.com/storybookjs/storybook/blob/next/code/lib/builder-webpack5/src/preview/base-webpack.config.ts#L54-L62)
```typescript
{
  test: /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
  type: 'asset/resource',
  generator: {
    filename: isProd
      ? 'static/media/[name].[contenthash:8][ext]'
      : 'static/media/[path][name][ext]',
  },
},
```
따라서, 다음과 같이 변경하였습니다. [참고 rule-exclude](https://webpack.kr/configuration/module/#ruleexclude)
```typescript
// 추가한 부분
config.module.rules
  .filter(rule => rule.test.test('.svg')) // svg의 규칙을 찾습니다.
  .forEach(rule => {
    rule.exclude = /\.svg$/i // 기본 규칙에서 svg를 제거합니다.
  })

config.module.rules.push({
  test: /\.svg$/,
  use: ['@svgr/webpack'],
})
```


## 해결
### 이제 해결 되었습니다!  
webpack 설정 전 `object`로 나타나던 `svg`가 webpack 설정 후 정상적으로 `react component`로 컴파일된 것을 볼 수 있습니다.

webpack 설정 전   
![image](https://user-images.githubusercontent.com/84620459/231258640-cbb687b3-55a3-45e1-b0e5-6099ee9ade59.png)

webpack 설정 후  
![image](https://user-images.githubusercontent.com/84620459/231258240-e28dbe99-37b2-4841-ba77-3f715b9387dc.png)

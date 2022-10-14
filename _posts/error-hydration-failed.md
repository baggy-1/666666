---
categories:
  - error
date: "2022-10-13"
description: "Unhandled Runtime Error
Error: Hydration failed because the initial UI does not match what was rendered on the server."
tags:
  - swr
  - next.js
  - hydration
  - error
title: Hydration failed Error
---

# 포스팅하면서 생긴 Error
> swr 관련 포스팅을 하던 중, 만나게 된 에러이다.  

### 환경
- next.js (create-next-app)
- typescript
- emotion
- swr

### Error
```bash
Unhandled Runtime Error
Error: Hydration failed because the initial UI does not match what was rendered on the server.

See more info here: https://nextjs.org/docs/messages/react-hydration-error
```

### 상황
포스팅 당시, 작성 중인 md파일을 저장 후 reloading 중 나타났다
해당 파일의 이름은 `swr.md`이다

### 원인
처음에는 에러의 참고 url을 보았다.
1. `SSG`로 만들어진 `React tree`와 브라우저에서의 첫 `React 렌더링 트리`와 다르기 때문에 에러가 발생

2. `css-in-js` 라이브러리에서 SSG/SSR에 대한 환경설정을 하지 않은 경우(또는, 잘못 된 경우) 종종 hydration 불일치 에러가 발생  
`emotion`을 사용하고 있었기에 설정 방법을 바꿔보았으나, 에러는 계속되었다

3. <del>다른 포스팅을 확인해봤는데, `swr.md` 파일에서만 해당 에러가 발생했다.  
파일 이름 `swr`을 `swr-ssg-cache-stale-while-revalidate`로 바꾸었더니 에러가 없어지고 정상 작동하였다<del>  

<del>정확한 원인(코드)은 모르겠지만 hydration 과정에서 파일명 `swr`이 `SWR`라이브러리와 충돌이 있었을 것으로 예상된다.<del>

4. 작성 중인 md파일 `<strong>`을 사용하였는데 그 부분을 제거하니 문제가 없어졌다  
md파일 내부에서 html tag를 사용하면 문제가 발생하는 듯 하다
```
// 문제 발생
# SWR
> <strong>SWR<strong>은 ~~ 전략이다

-->

// 해결
# SWR
> `SWR`은 ~~ 전략이다
```

### 해결
md 파일 내부의 `<strong>` 태그를 제거하여 해결하였다

<del>
파일명을 바꾸었다  
`swr.md` -> `swr-ssg-cache-stale-while-revalidate.md`
<del>
---
categories:
  - dev
date: "2022-10-19"
description: "jwt 토큰을 axios intercepters를 이용해 유저 정보를 깔끔하게 불러와보자"
tags:
  - swr
  - axios
title: axios intercepters 사용기
public: true
---
# 왜 사용하게 되었나?
> access token으로 유저 정보를 가지고 오는데, access token이 만료되면 refresh token을 사용하여 access token을 응답 받고 유저 정보를 재호출 해야 했다.  
> 하지만 실제 코드로 구현해보니 코드가 복잡해졌고, 더러워(?) 보였다.  
> 코드를 개선하기 위해 검색을 해보니 `axios interceptors`를 이용하여 동일한 작업을 깨끗(?)하게 할 수 있었다.  

# Axios Interceptors
> `then`, `catch`와 같은 요청 전후, 응답 전후에 필요한 작업을 할 수 있다  
> [axios/interceptors](https://yamoo9.github.io/axios/guide/interceptors.html)

axios 문서에서는 다음과 같이 설명되어 있다.
```javascript
// 요청 인터셉터 추가
axios.interceptors.request.use(
  function (config) {
    // 요청을 보내기 전에 수행할 일
    // ...
    return config;
  },
  function (error) {
    // 오류 요청을 보내기전 수행할 일
    // ...
    return Promise.reject(error);
  });

// 응답 인터셉터 추가
axios.interceptors.response.use(
  function (response) {
    // 응답 데이터를 가공
    // ...
    return response;
  },
  function (error) {
    // 오류 응답을 처리
    // ...
    return Promise.reject(error);
  });
```

실제 프로젝트에 적용
```typescript
// instance.ts

const instance = axios.create({
    baseURL: "api_base_url", // 엔드 포인트 앞의 기본 주소
    timeout: 1000, // 설정 시간까지 응답을 주지 않으면 연결을 끊음
});

// 요청
instance.interceptors.request.use(
    (config) => {
        // config는 요청 config

        const accessToken = getCookie("access_token"); // access token 가져 옴
        const headers = config.headers || {}; // headers 없으면 초기화
        headers["Authorization"] = "";

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`; // 헤더 값 설정

            return config;
        }
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

// 응답
instanse.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const { response, config } = error;

        if (response?.status === 401) { // 401 인증 에러
            const refreshToken = getCookie("refresh_token"); // refresh token 가져오기

            if (refreshToken) {
                const { data } = await axios.post(
                    "refresh_end_point",
                    {
                        refresh_token: refreshToken,
                    }
                ); // access token 가져오기

                const { access_token, access_exp } = data;
                // 쿠키 저장
                setCookie("access_token", access_token);
                setCookie("access_exp", access_exp);

                const headers = config.headers || {};
                headers["Authorization"] = `Bearer ${access_token}`; // 기본 헤더 설정

                return axios(config); // 다시 요청
            }
        }

        return Promise.reject(error);
    }
)

export { instance };
```

```typescript
// fetcher.ts

import { instance } from "instance";

const fetcher = async (url: string) => {
    const { data } = await instance.get(url);

    return data;
};

export { fetcher };
```

```typescript
// useUser.ts

import { fetcher } from fetcher;
import useSWR from "swr";
import { User } from "types";

const useUser = () => {
    const { data, error } = useSWR<User>("/api/user", fetcher);

    return {
        user: data,
        loading: !error && !data,
        error,
    };
};

export default useUser;
```

```typescript
// profile.ts

const Profile = () => {
    const { user, loading, error } = useUser();

    if (loading) return <div>로딩...</div>
    if (error) return <div>에러...</div>

    return (
        <div>{user.name}</div>
    )
}
```
---
categories:
  - dev
date: "2022-10-13"
description: SWR을 사용하여 ssg props 값을 client에서 재사용 해보자!
tags:
  - swr
  - next.js
title: SWR 사용기
---

# SWR
> <strong>SWR<strong>은 [HTTP RFC 5861](https://www.rfc-editor.org/rfc/rfc5861)로 알려진 HTTP 캐시 무효화 전략 `stale-while-revalidate`에서 유래된 데이터 가져오기 전략이다  
> SWR은 데이터를 먼저, `cache(stale)`에서 데이터를 가져온 후, 데이터를 fetch하여 최신 데이터를 반환하는 전략이다  

## stale-while-revalidate
> [HTTP RFC 5861](https://www.rfc-editor.org/rfc/rfc5861)

## SSG, SSR에서 사용하기
> client에서 데이터를 가져오는 것과 비슷하지만, `getStaticProps()`에서 추가적인 작업이 필요하다  
기존 Props에서 넘겨주던 값을 해당 값이 필요한 최상위 컴포넌트 위에서 내려준다

```typescript
export async function getStaticProps () {
  // `getStaticProps`는 서버 사이드에서 실행됩니다.
  const article = await getArticleData()
  return {
    props: {
      fallback: {
        // key: data
        '/api/article': article
      }
    }
  }

  /**
   * 기존 SSG return
   * 
   * return {
   *  props: {
   *    article,
   *  }
   * }
   */
}

function Article() {
  // `data`는 `fallback`에 있기 때문에 항상 사용할 수 있습니다.
  // fallback에서 사용된 `key`값에 맞는 데이터를 가져 옴(cache)
  // fetcher는 해당 key를 매개변수로 받아 사용
  const { data } = useSWR('/api/article', fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  // `SWRConfig` 경계 내부에 있는 SWR hooks는 해당 값들을 사용합니다.
  // `SWRConfig`로 해당 값이 필요한 최상위 컴포넌트를 감싸고 value값을 넣어 줌
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

### Complex Keys
> swr key를 하나의 string 값이 아닌 여러 개의 key를 하나의 key로 사용하는 방법  
여러 개의 key를 조합하지만 결국, 하나의 string이 됨

```typescript
import useSWR, { unstable_serialize } from 'swr'

export async function getStaticProps () {
  // 위의 예제와 달리 값을 이용하여 api를 호출한다
  const article = await getArticleFromAPI(1)
  return {
    props: {
      fallback: {
        // unstable_serialize()에 배열 스타일의 키
        // key 값이 3개
        // unstable_serialize(["api", "article", 1])
        // return: @"api","article",1,
        // type: string
        [unstable_serialize(['api', 'article', 1])]: article,
      }
    }
  }
}

function Article() {
  // 배열 스타일의 키 사용
  // 조합된 key 값을 매칭
  const { data } = useSWR(['api', 'article', 1], fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

```typescript
// use-swr.d.ts
export declare const unstable_serialize: (key: Key) => string;
```

```javascript
// swr/dist/index.js
var unstable_serialize = function (key) { return serialize(key)[0]; };

// 매개변수 key가 함수, string, 배열인지에 따른 분기
// 예제는 배열을 넣었기에 stableHash(key)를 탄다
var serialize = function (key) {
    if (isFunction(key)) {
        try {
            key = key();
        }
        catch (err) {
            // dependencies not ready
            key = '';
        }
    }
    var args = [].concat(key);
    // If key is not falsy, or not an empty array, hash it.
    key =
        typeof key == 'string'
            ? key
            : (Array.isArray(key) ? key.length : key)
                ? stableHash(key) // 예제의 경우 여기에 도달
                : '';
    var infoKey = key ? '$swr$' + key : '';
    return [key, args, infoKey];
};

// 이전 key를 arg로 받음
var table = new WeakMap();

var stableHash = function (arg) {
    var type = typeof arg;
    var constructor = arg && arg.constructor;
    var isDate = constructor == Date;
    var result;
    var index;
    if (OBJECT(arg) === arg && !isDate && constructor != RegExp) {
        // Object/function, not null/date/regexp. Use WeakMap to store the id first.
        // If it's already hashed, directly return the result.
        // arg값으로 cache 데이터를 가져 옴
        result = table.get(arg);
        if (result)
            return result;
        // Store the hash first for circular reference detection before entering the
        // recursive `stableHash` calls.
        // For other objects like set and map, we use this id directly as the hash.
        // 순환 참조를 위해 먼저 처리하는데, 아직 잘 이해가 안된다
        result = ++counter + '~';
        table.set(arg, result);

        // 예제의 return 값 @"api","article",1, 이 여기서 나온 것을 알 수 있음
        if (constructor == Array) {
            // Array.
            result = '@';
            for (index = 0; index < arg.length; index++) {
                result += stableHash(arg[index]) + ',';
            }
            // 여기서 cache 저장
            table.set(arg, result);
        }
        if (constructor == OBJECT) {
            // Object, sort keys.
            result = '#';
            var keys = OBJECT.keys(arg).sort();
            while (!isUndefined((index = keys.pop()))) {
                if (!isUndefined(arg[index])) {
                    result += index + ':' + stableHash(arg[index]) + ',';
                }
            }
            table.set(arg, result);
        }
    }
    else {
        result = isDate
            ? arg.toJSON()
            : type == 'symbol'
                ? arg.toString()
                : type == 'string'
                    ? JSON.stringify(arg)
                    : '' + arg;
    }
    return result;
};
```
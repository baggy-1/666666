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
> `SWR`은 [HTTP RFC 5861](https://www.rfc-editor.org/rfc/rfc5861)로 알려진 HTTP 캐시 무효화 전략 `stale-while-revalidate`에서 유래된 데이터 가져오기 전략이다  
> SWR은 데이터를 먼저, `cache(stale)`에서 데이터를 가져온 후, 데이터를 fetch하여 최신 데이터를 반환하는 전략이다  

## stale-while-revalidate
> [HTTP RFC 5861](https://www.rfc-editor.org/rfc/rfc5861)  
> [Cache-control](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control)

The stale-while-revalidate HTTP Cache-Control extension allows a cache to immediately return a stale response while it revalidates it in the background, thereby hiding latency (both in the network and on the server) from clients.

stale-while-revalidate 확장은 백그라운드에서 재검증을 하는 동안 오래된 응답을 즉시 반환하여 대기 시간을 숨길 수 있다

```bash
Cache-Control: max-age=600, stale-while-revalidate=30
```

`max-age=<seconds>`  
- 리소스가 최신 상태라고 판단할 최대 시간을 지정합니다. Expires에 반해, 이 디렉티브는 요청 시간과 관련이 있습니다.(mdn docs)
- max-age 이전의 시간에서는 최신 상태라고 판단
- ~600초: 최신 상태 판단  

`stale-while-revalidate=<seconds>`
- 비동기 적으로 백그라운드 에서 새로운 것으로 체크인하는 동안 클라이언트가 최신이 아닌 응답을 받아 들일 것임을 나타냅니다. 초 값은 클라이언트가 최신이 아닌 응답을 받아 들일 시간을 나타냅니다.(mdn docs)
- max-age 시간 후 백그라운드에서 응답을 가져오는 동안 `stale`한 응답을 받는 시간
- 600~630초: 최신이 아닌 응답을 받는 시간
- 630초~: 재요청

## SSG, SSR에서 사용하기
> [swr/with-nextjs](https://swr.vercel.app/ko/docs/with-nextjs)
> client에서 데이터를 가져오는 것과 비슷하지만, `getStaticProps()`에서 추가적인 작업이 필요하다  
기존 Props에서 넘겨주던 값을 해당 값이 필요한 최상위 컴포넌트 위에서 내려준다

### swr docs 예제
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
  // fetcher는 비동기 함수
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

### 프로젝트에 적용
```typescript
// index.tsx

export const getStaticProps: GetStaticProps = () => {
  // 모든 post의 meta data를 가져 옴 (블로그 첫 페이지에서 보여 줄 데이터)
  const allPostMetaData = getAllPostMetaData();

  return {
    props: {
      fallback: {
        post: allPostMetaData,
      },
    },
  };
};

// getStaticProps에서 넘겨준 Props을 여기서 안 받음
const Home: NextPage = () => {
  return (
    <>
      <PostListView />
    </>
  );
};

// 여기서 getStaticProps에서 넘겨준 Props을 받음
// 전달한 Props의 fallback 값을 넣어 줌
// fallback: SWR hook의 초기 값으로 미리 가져온 데이터를 제공할 수 있음
// 위에서, fallback으로 값을 넣어준 이유
// https://swr.vercel.app/ko/blog/swr-v1#fallback-%EB%8D%B0%EC%9D%B4%ED%84%B0
const HomePage = ({ fallback }: PageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Home />
    </SWRConfig>
  );
};

export default HomePage;
```
```typescript
// PostListView.tsx

const PostListView = () => {
  // SWRConfig의 value로 넣어준 fallback(초기 값)
  // fallback에서 같은 key("post")로 데이터를 가져 옴
  // SWRConfig 내부의 컴포넌트라면 같은 값을 사용 가능
  // fetcher는 따로 사용하지 않았음
  const { data } = useSWR<MetaDataPath[]>("post");

  if (!data) return <div>Sorry, No Data</div>;

  return (
    <div>
      {data.title}
    </div>
  );
};
```

## SWRConfig
> Context Provider와 value를 가진 react component Element를 반환

```typescript
// SWRConfig 타입

var SWRConfig: (props: any) => react.FunctionComponentElement<react.ProviderProps<{}>>
```
```javascript
// swr/dist/index.js

var SWRConfigContext = react.createContext({});
var SWRConfig$1 = function (props) {
    // SWGConfig value에 넣어준 값
    var value = props.value;

    // 여기서 fallback data를 합침
    var extendedConfig = mergeConfigs(react.useContext(SWRConfigContext), value);
    var provider = value && value.provider;
    var cacheContext = react.useState(function () {
        return provider
            ? initCache(provider(extendedConfig.cache || cache), value)
            : UNDEFINED;
    })[0];
    if (cacheContext) {
        extendedConfig.cache = cacheContext[0];
        extendedConfig.mutate = cacheContext[1];
    }
    useIsomorphicLayoutEffect(function () { return (cacheContext ? cacheContext[2] : UNDEFINED); }, []);

    // Context Provider component와 props
    return react.createElement(SWRConfigContext.Provider, mergeObjects(props, {
        value: extendedConfig
    }));
};

var mergeConfigs = function (a, b) {
    var v = mergeObjects(a, b);
    if (b) {
        // 여기서 옵션 값으로 넣어 준 fallback 옵션을 가져 옴
        var u1 = a.use, f1 = a.fallback;
        var u2 = b.use, f2 = b.fallback;
        if (u1 && u2) {
            v.use = u1.concat(u2);
        }
        if (f1 && f2) {
            v.fallback = mergeObjects(f1, f2);
        }
    }
    return v;
};

// SWRConfig$1 obj에 "default"속성의 "value"를 추가로 넣어주고 export 함
var SWRConfig = OBJECT.defineProperty(SWRConfig$1, 'default', {
    value: defaultConfig
});
```

## useSWR
> SWRConfigContext의 값을 가져와서 미리 fallback에 넣어 준 data를 가져와 준다

```typescript
// useSWR 타입

var useSWR: (...args: any[]) => any
```
```javascript
var useSWR = withArgs(useSWRHandler);

var withArgs = function (hook) {
    return function useSWRArgs() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }

        // SWRConfigContext에 있던 값을 가져 옴
        var fallbackConfig = useSWRConfig();
        var _a = normalize(args), key = _a[0], fn = _a[1], _config = _a[2];
        var config = mergeConfigs(fallbackConfig, _config);
        // Apply middleware
        var next = hook;
        var use = config.use;
        if (use) {
            for (var i = use.length; i-- > 0;) {
                next = use[i](next);
            }
        }
        return next(key, fn || config.fetcher, config);
    };
};

var useSWRConfig = function () {
    // SWRConfigContext의 값 가져오기
    return mergeObjects(defaultConfig, react.useContext(SWRConfigContext));
};
var useSWRHandler = function (_key, fetcher, config) {
    var cache = config.cache, fallbackData = config.fallbackData;
    //...

    // useSWR을 사용해서 data를 가져올 때, 왠지 여기서 fallbackData를 가져오는 것 같다
    var cached = cache.get(key);
    var fallback = isUndefined(fallbackData)
        ? config.fallback[key]
        : fallbackData;
    var data = isUndefined(cached) ? fallback : cached;

    //...
    return {
    mutate: boundMutate,
    get data() {
        stateDependencies.data = true;
        return data;
    },
    get error() {
        stateDependencies.error = true;
        return error;
    },
    get isValidating() {
        stateDependencies.isValidating = true;
        return isValidating;
    }
};
};
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
            key = '';
        }
    }
    var args = [].concat(key);
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
        // arg값으로 cache 데이터를 가져 옴
        result = table.get(arg);
        if (result)
            return result;
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
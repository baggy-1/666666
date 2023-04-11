---
categories:
  - dev
date: "2023-04-11"
description: "Intersection Observer API를 사용하여 렌더링 속도를 최적화 해보자"
tags:
  - react
  - performance
title: "하나의 컴포넌트로 렌더링 속도 최적화하기"
public: true
---

# 결론부터
[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 사용하여 Element의 Intersect인 경우 children을 렌더링하는 LazyLoadingVisible 컴포넌트를 제작하여 현재 화면에 보이지 않는 요소들을 최소한으로 렌더링하여 최적화합니다.

메인 페이지: `337.4ms` -> `135.4ms` (약 `59.9%` 개선)  
뉴스 헤드라인 페이지: `185ms` -> `28.6ms` (약 `84.5%` 개선)


### 최적화 전
- 메인 페이지
![최적화 전 메인페이지](https://user-images.githubusercontent.com/84620459/231168695-dbc47772-a952-4bf4-9b4c-59f39589f945.PNG)

- Profiler로 측정한 뉴스 카드 렌더링 시간
![react profiler로 측정한 시간](https://user-images.githubusercontent.com/84620459/231169920-ee3c83f5-c7d0-4792-a3bd-700a6b589f60.PNG)

- Profiler로 측정한 헤드라인 렌더링 시간
![lazy_loading_before_text_profiler_시간](https://user-images.githubusercontent.com/84620459/231170896-3e4c1215-e42c-41ee-afe8-63d952fe087e.PNG)

### 최적화 후
- 메인 페이지
![lazy_loading_after_main](https://user-images.githubusercontent.com/84620459/231171468-e79b75ba-c4ac-4c8e-8eb7-6bac4f81b4b5.PNG)

- Profiler로 측정한 뉴스 카드 렌더링 시간
![lazy_loading_after_main](https://user-images.githubusercontent.com/84620459/231174037-9619d371-f8ff-4050-abb4-0f1dbf01d211.PNG)

- Profiler로 측정한 헤드라인 렌더링 시간
![lazy_loading_after_text_profiler_시간](https://user-images.githubusercontent.com/84620459/231171176-38f3fa08-d7b9-4a68-ba91-91b6cd6bcd1c.PNG)

# 개요
간단한 뉴스 서비스의 메인 페이지에서는 서비스 시작일부터 오늘까지의 뉴스 헤드라인 카드를 모아서 보여줍니다.  
이 때, 사용자가 보고 있는 위치에 상관없이 모든 뉴스 헤드라인 카드가 렌더링되고 내부에는 이미지가 존재하여 같이 로딩됩니다. 지금은 서비스가 시작된지 두 달정도라 50개 정도의 카드가 렌더링되지만 서비스가 지속됨에 따라 계속 렌더링 속도는 늘어날 것입니다.  
따라서, 사용자가 스크롤을 내려서 이전 날짜의 뉴스 카드를 볼 때, 렌더링한다면 좋은 사용자 경험을 줄 수 있을 것입니다.  

# 구현
기본 컨셉
```typescript
 const NewsCard = () => {
    const [isVisible, setIsVisible] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null); // observer element

    useEffect(() => {
        if (ref.current) {
            observerRef.current = new IntersectionObserver(([{ isIntersecting }]) => {
                setIsVisible(isIntersecting); // 교차하는지 여부
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0,
            })
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect(); // 모든 객체의 탐지 해제
            }
        }
    }, [observerRef])

    return (
        <ObserverWrapper ref={observerRef}> // Observer Wrapper Element
            {isVisible ? (
                <Card> // 기존 컴포넌트
                    ...
                </Card>
            ) : null}
        </ObserverWrapper>
    )
 }
```
위의 코드와 같이 작성하면 NewsCard가 사용자의 화면에 보일 때 렌더링이 되고 보이지 않을 때는 렌더링 되지 않습니다. 하지만 저는 원하는 건 한 번 렌더링 된 이후에는 계속 렌더링 된 상태이길 원했습니다. 따라서 아래와 같이 코드를 수정했습니다.
```typescript
...

useEffect(() => {
    if (ref.current) {
        observerRef.current = new IntersectionObserver(([{ isIntersecting }]) => {
            if (isIntersecting) {    
                setIsVisible(true); // intersect 상태라면 true 고정
            }
        },

        ...
    }

    ...
}, [observerRef])

...
```

이제 동작을 확인했으니 다른 컴포넌트에도 사용할 수 있게 custom hook으로 빼봅시다.
```typescript
const useVisibility: UseVisibility = (
  ref,
  { threshold = 0 } = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (ref.current) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold,
      };

      observer.current = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          setIsVisible(true);
        }
      }, options);

      observer.current.observe(ref.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ref]);

  return isVisible;
};

```
이러면 다른 컴포넌트에서도 재사용 가능합니다.  
하지만 뭔가 또 마음에 안드는 부분이 있습니다. 이미 만들어진 컴포넌트에서 해당 기능을 사용하고 싶으면 기존 컴포넌트를 감싸는 Wrapper Component가 필요하고 내부에 useVisibility hook을 작성해야 합니다. 기존 컴포넌트 로직을 변경하지 않기 위해 사용하고 싶은 컴포넌트를 `children`으로 받는 `LazyLoadingVisible` 컴포넌트를 제작해봅시다.
```typescript
const LazyLoadingVisible = ({
  width = 'auto',
  height = 'auto',
  threshold = 0,
  children,
}: Props) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibility(observerRef, {
    threshold,
  });

  return (
    <div
      css={css`
        width: ${width};
        height: ${height};
      `}
      ref={observerRef}
    >
      {isVisible ? children : null}
    </div>
  );
};
```
특이하게도 `width`와 `height`를 받고 있는데, 만약 크기가 지정되지 않고 초기에 null을 return한다면 isVisible이 모두 true가 되고 다시 false가 되면서 불필요한 렌더링이 발생할 것입니다. 따라서 children 컴포넌트의 사이즈와 비슷하거나 동일한 사이즈를 미리 작성하면 이 부분을 해결할 수 있습니다.  

아래는 실제 프로젝트에서 사용하는 예제입니다.
```typescript
return (
    <Grid>
        {items.map(item => {
            return (
                <LazyLoadingVisible width="10rem" height="12rem">
                    <NewsCard key={item.id} {...item} />
                </LazyLoadingVisible>
            );
        })}
    </Grid>
);
```

포스트 처음에도 작성하였지만 해당 방식으로 메인 페이지 로딩 속도가 `337.4ms` -> `135.4ms`로 약 `59.9%` 개선되었고 뉴스 헤드라인 페이지 로딩 속도도 `185ms` -> `28.6ms`로 약 `84.5%` 개선되었습니다.

기존보다 개선되었지만 요소를 감지하기 위해 `ref`값을 받아야 하기 때문에 여전히 `div element`는 item의 개수만큼 렌더링됩니다.
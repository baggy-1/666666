---
categories:
  - dev
date: "2023-04-18"
description: "Push API를 활용해서 사용자에게 알림을 보내봅시다."
tags:
  - web-push
  - pwa
title: "Push API 사용하기"
public: true
---

# 개요
간단한 뉴스 프로젝트를 진행하면서 매일 6시 뉴스 헤드라인이 발행될 때, 발행 정보를 push 알림으로 알려주면 좋겠다고 생각했습니다.  
[Push API](https://developer.mozilla.org/ko/docs/Web/API/Push_API)를 활용하면 네이티브 앱이 아닌 웹 사이트에서도 사용자에게 push 알림을 보낼 수 있습니다.

# 동작 방식
기본적인 동작 방식은 다음과 같습니다.
1. 클라이언트에서 사용자에게 알림 권한을 요청합니다.
2. 요청이 승인된다면 알림 구독 정보를 서버에 저장합니다.
3. 서버에서 저장한 구독 정보로 push 이벤트를 발생시킵니다.
4. 클라이언트에서 push 이벤트를 감지하고 사용자에게 알림을 보여줍니다.


# 프로젝트에 적용 하기
> [web-push](https://github.com/web-push-libs/web-push#readme) 라이브러리를 사용하여 진행하였습니다.


## 권한 확인  

`Notification.permission`을 통해 `denied`인 경우 진행하지 않습니다.  

|값|의미|
|---|---|
|default|응답 전|   
|granted|승인|  
|denied|거절|  

## 사용자가 서비스워커가 있는지, PushManager가 있는지 확인
```typescript
if (('serviceWorker' in navigator) === true)  // OK
if ((`PushManager` in window) === true) // OK
```

## `web-push`라이브러리로 공개키, 비밀키 생성
키는 한 번만 생성하고 저장하면 됩니다.  
여러 번 생성할 필요가 없습니다.
```typescript
const vapidKeys = webpush.generateVAPIDKeys();

const PUBLIC_KEY = vapidKeys.publicKey;
const PRIVATE_KEY = vapidKeys.privateKey;
```

## serviceWorker의 register를 통해 구독
```typescript
// 만들어둔 serviceWorker 파일 등록
navigator.serviceWorker.register('/sw.js');

// serviceWorker가 활성화 되기를 기다림
const registration = await navigator.serviceWorker.ready;

// 활성화된 serviceWorker를 통해 기존 구독 정보를 가져옴
const userSubscription = await registration.pushManager.getSubscription();

// 앞서 생성한 서버 공개키
const applicationServerKey = PUBLIC_KEY;

// 구독 정보가 없다면 새로운 구독 정보를 생성함
const newSubscription = await registration.pushManager.subscribe({
    // 무음으로 표시되지 않고 유저가 볼 수 있는지 여부
    // 값이 없거나 false인 경우, 알림이 가지 않음 -> 무음 지원 X
    userVisibleOnly: true,
    // 서버에서 생성한 공개키
    // 해당 프로젝트의 경우 web-push 라이브러리를 통해 생성함
    applicationServerKey,
  });

// web-push 라이브러리에서 활용할 endpoint, p256dh, auth key를 구독정보에서 가져옴
const { endpoint } = newSubscription;
const p256dh = newSubscription.getKey('p256dh');
const auth = newSubscription.getKey('auth');
```

## 사용자의 구독 정보를 서버에 저장
해당 프로젝트에서는 `firebase`에 저장하였습니다.

## `push` 이벤트 발생시키기
```typescript
webpush.setVapidDetails(
    // 사용자가 문의 등을 할 이메일을 작성
    'mailto:your@email.com',
    // 공개키
    PUBLIC_KEY,
    // 비밀키
    PRIVATE_KEY,
)

const payload = {
    // 알림에 사용할 title
    title: '간단한 뉴스',
    // 알림에 사용할 body
    body: '방금 새로운 뉴스가 도착했습니다!',
    // click시 이동할 url
    link: 'https://your-site-url.com'
};

// 서버에 저장한 구독 정보를 가져옴
const subscription = await getSubscription();

// web-push 라이브러리를 사용하여 payload를 가지고 push 이벤트를 발생
webpush.sendNotification(subscription, JSON.stringify(payload));
```

## 이벤트를 감지하고 사용자에게 `push` 알림을 보냄
```typescript
// `push` 이벤트를 감지
self.addEventListener('push', event => {
  // 이전에 서버에서 보낸 payload를 가져옴
  const payload = JSON.parse(event?.data.text() || '{}');

  event?.waitUntil(
    self.clients.matchAll().then(clientList => {
      // 첫 번째 인자로 title 값이 들어감
      return self.registration.showNotification(payload.title, {
        // 알림에 보여질 body
        body: payload.body,
        // click시 보여질 link 정보를 data로 저장
        data: { link: payload.link },
        // 언어
        lang: 'ko-KR',
        // tag
        tag: 'tag',
        // 알림 진동
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        // 보여질 image body
        image: 'https://your-image.png',
        // 보여질 icon
        icon: 'https://your-icon.png',
        // 작은 badge icon
        badge: 'https://your-badge.png',
      });
    })
  );
});

// 알림 click을 감지
// click하면 link로 이동하기 위함
self.addEventListener('notificationclick', event => {
  event?.waitUntil(
    self.clients.matchAll().then(clientList => {
      // click하면 알림을 닫음
      event.notification.close();

      // openWindow로 data.link로 보낸 link url을 오픈
      return self.clients.openWindow(event.notification.data.link);
    })
  );
});
```
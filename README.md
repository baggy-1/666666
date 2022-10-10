# Next.js로 마크다운 블로그 만들기

> .md 파일을 읽을 수 있는 블로그를 만듭니다.

[:link: 블로그](https://666666-liard.vercel.app)

## 폴더 구조 및 라우팅

> 사용자는 루트 경로의 `__posts` 폴더에 작성된 마크다운 파일(.md)를 작성할 수 있어야 합니다.  
> 해당 파일은 마크다운 본문과 게시물에 대한 `meta data`를 담을 수 있어야 합니다.

```
Project
├─ README.md
├─ _posts
│  ├─ hello.md
│  ├─ imfine.md
│  └─ markdown.md
├─ components
│  └─ layout
│     ├─ Footer.tsx
│     ├─ Layout.tsx
│     └─ Nav.tsx
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ pages
│  ├─ [id].tsx
│  ├─ _app.tsx
│  ├─ api
│  └─ index.tsx
├─ public
│  └─ svg
│     └─ github-icon.svg
├─ styles
│  ├─ globals.css
│  └─ reset.css
├─ tsconfig.json
├─ types
│  └─ post.ts
└─ utils
   └─ post.ts
```

## 블로그에 작성된 게시물을 렌더링하는 `목록 페이지`와 개별 게시물을 렌더링하는 `상세 페이지`로 나누어 작성해주세요.

- `/` - 목록 페이지
- `/[id]` - 상세 페이지
- 마크다운을 JavaScript로 변환해주는 도구는 `remark`(마크다운 Parser), `remark-html`(remark로 파싱한 데이터를 html로 변환) 을 참고
- 각 마크다운의 meta data는 `gray-matter`, `frontmatter` 참고
- 마크다운을 React에 삽입할 때는 `dangerouslySetInnerHTML` 을 사용 ([참고 링크](https://ko.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml))
- (추가 구현) 코드 하이라이터는 `highlight.js`, `prism.js` 를 참고

### md 파일 읽고 html 변환

> `remark`와 `remark-html`, `remark-gemoji`, `gray-matter`

```typescript
// post.ts

import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGemoji from "remark-gemoji";
import matter from "gray-matter";

// gray-matter read(): meta data + md content 읽기

const getPost = async (path: string) => {
  const post = matter.read(`_posts/${path}.md`);
  const { content: postContent, data: meta } = post;
  const parseContent = await remark()
    .use(remarkHtml, { sanitize: false })
    .use(remarkGemoji)
    .processSync(postContent);

  const content = parseContent.value.toString();

  return {
    meta,
    content,
  };
};
```

### 코드 하이라이터

> `highlight.js`

```typescript
const DetailPosts = ({ post }: Props) => {
  useEffect(() => {
    // <pre>, <code> tag를 찾아서 highlighting 해줌
    hljs.highlightAll();

    // <pre><code></code></pre> 사이에 <(&lt), >(&gt) 등 escape 문자가 그대로 나와있어서 위험하다고 경고하는데 그 경고를 무시하는 속성
    hljs.configure({ ignoreUnescapedHTML: true });
  });

  return (
    <>
      <div>// ...</div>
    </>
  );
};
```

### `getStaticProps`

> 정적 페이지를 생성할 때 사용하는 메서드

```typescript
export const getStaticProps: GetStaticProps = async (context) => {
  // context에 params 값이 들어있고 params 내부에 동적라우팅에 사용된 [id] 값이 들어 있음
  const postNull = {
    props: {
      post: null,
    },
  };

  const { params } = context;
  if (!params) return postNull;

  const { id } = params;
  if (typeof id !== "string") return postNull;

  const post = await getPost(id);

  // return 값을 전달함
  return {
    props: {
      post,
    },
  };
};
```

### `getStaticPaths`

> 지정된 모든 경로를 빌드 시 미리 렌더링 함

```typescript
export const getStaticPaths = () => {
  const paths = getAllPostPath();

  /**
   *   paths = [
   *    {
   *        params: {
   *            id: "path_name"
   *        }
   *    }
   *  ]
   **/

  /**
   * fallback: false
   * 지정되지 않은 모든 경로는 404 page
   **/

  return {
    paths,
    fallback: false,
  };
};

const getAllPostPath = () => {
  const allPost = readDirPosts();
  const allPostPath = allPost.map((post) => ({
    params: {
      id: replaceExtension(post, "md"),
    },
  }));

  return allPostPath;
};

const readDirPosts = () => {
  return fs.readdirSync("_posts", { encoding: "utf-8" });
};

const replaceExtension = (path: string, extension: string) => {
  const regExp = new RegExp(`\.${extension}$`);
  return path.replace(regExp, "");
};
```

import { css } from "@emotion/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Post } from "types/post";

const PostView = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: post } = useSWR<Post>(["post", id]);

  if (!post) return <div>포스트 없음</div>;
  const { content } = post;

  return (
    <div css={wrapper}>
      <div css={metaWrapper}>
        <h1 css={h1}>{post.meta.title}</h1>
        <h2 css={h2}>{post.meta.description}</h2>
      </div>
      <section
        className="markdown-body"
        css={section}
        dangerouslySetInnerHTML={{ __html: content }}
      ></section>
    </div>
  );
};

export default PostView;

const metaWrapper = css({
  maxWidth: "50rem",
  width: "100%",
  padding: "0 45px",
});

const h2 = css({
  fontSize: "1.5rem",
  fontWeight: "500",
});

const h1 = css({
  fontSize: "2rem",
  fontWeight: "700",
});

const wrapper = css({
  minHeight: "calc(100vh - 4rem - 3rem)",
  height: "100%",
  color: "#c9d1d9",
  backgroundColor: "#0d1117",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "6rem",
});

const section = css({
  maxWidth: "50rem",
  width: "100%",
  "& ol, ul": {
    listStyle: "unset",
  },
});

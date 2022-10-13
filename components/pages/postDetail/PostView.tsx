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
      <section
        className="markdown-body"
        css={section}
        dangerouslySetInnerHTML={{ __html: content }}
      ></section>
    </div>
  );
};

export default PostView;

const wrapper = css({
  minHeight: "calc(100vh - 4rem - 3rem)",
  height: "100%",
  color: "#c9d1d9",
  backgroundColor: "#0d1117",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const section = css({
  maxWidth: "50rem",
  width: "100%",
});

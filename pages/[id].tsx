import { GetStaticProps } from "next";
import { useEffect } from "react";
import { MetaData, Post } from "types/post";
import { getAllPostPath, getPost } from "utils/post";
import hljs from "highlight.js";
import useSWR, { SWRConfig, unstable_serialize } from "swr";
import { useRouter } from "next/router";

interface PageProps {
  fallback: {
    [key: string]: {
      meta: MetaData;
      content: string;
    };
  };
}

const DetailPosts = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: post } = useSWR<Post>(["post", id]);

  useEffect(() => {
    hljs.highlightAll();
    hljs.configure({ ignoreUnescapedHTML: true });
  });

  if (!post) return <div>포스트 없음</div>;

  return (
    <>
      <div
        style={{
          minHeight: "calc(100vh - 4rem - 3rem)",
          height: "100%",
          color: "#c9d1d9",
          backgroundColor: "#0d1117",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <section
          className="markdown-body"
          style={{
            maxWidth: "100%",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></section>
      </div>
    </>
  );
};

export const getStaticPaths = () => {
  const paths = getAllPostPath();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context?.params?.id;

  if (!id || typeof id !== "string")
    return {
      props: {
        fallback: {},
      },
    };

  const post = getPost(id);

  return {
    props: {
      fallback: {
        [unstable_serialize(["post", id])]: post,
      },
    },
  };
};

const DetailPostsPage = ({ fallback }: PageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <DetailPosts />
    </SWRConfig>
  );
};

export default DetailPostsPage;

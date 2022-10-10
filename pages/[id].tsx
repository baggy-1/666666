import { GetStaticProps } from "next";
import { useEffect } from "react";
import { MetaData } from "types/post";
import { getAllPostPath, getPost } from "utils/post";
import hljs from "highlight.js";

interface Props {
  post: {
    meta: MetaData;
    content: string;
  };
}

const DetailPosts = ({ post }: Props) => {
  useEffect(() => {
    hljs.highlightAll();
    hljs.configure({ ignoreUnescapedHTML: true });
  });

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

export const getStaticProps: GetStaticProps = async (context) => {
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

  return {
    props: {
      post,
    },
  };
};

export default DetailPosts;
